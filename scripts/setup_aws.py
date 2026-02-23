import boto3
import json
import os
import sys

# Configuration
BUCKET_NAME = "zappa-seaman-fresh-deployments"
REGION = "us-east-1"

def load_env():
    """Load .env file manually to avoid dependency issues"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value

def save_creds(access_key, secret_key):
    """Save credentials to .env"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    
    # Read existing lines
    lines = []
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            lines = f.readlines()
            
    # Remove existing AWS keys
    lines = [l for l in lines if not l.startswith('AWS_ACCESS_KEY_ID') and not l.startswith('AWS_SECRET_ACCESS_KEY')]
    
    # Append new keys
    if lines and not lines[-1].endswith('\n'):
        lines.append('\n')
    lines.append(f"AWS_ACCESS_KEY_ID={access_key}\n")
    lines.append(f"AWS_SECRET_ACCESS_KEY={secret_key}\n")
    
    with open(env_path, 'w') as f:
        f.writelines(lines)
    print("✅ Credentials saved to .env file.")

def setup_s3():
    load_env()
    print(f"🚀 Starting AWS S3 Setup for '{BUCKET_NAME}'...")

    # Check for credentials
    session = boto3.Session()
    credentials = session.get_credentials()
    
    if not credentials:
        print("\n⚠️  AWS Credentials not found!")
        print("Please enter your AWS Access Keys (Security Credentials from IAM Console).")
        access_key = input("AWS Access Key ID: ").strip()
        secret_key = input("AWS Secret Access Key: ").strip()
        
        if not access_key or not secret_key:
            print("❌ Error: Keys cannot be empty.")
            return

        os.environ['AWS_ACCESS_KEY_ID'] = access_key
        os.environ['AWS_SECRET_ACCESS_KEY'] = secret_key
        save_creds(access_key, secret_key)
        
    # Initialize S3 client
    try:
        s3 = boto3.client('s3', region_name=REGION)
        # Check if bucket exists
        try:
            s3.head_bucket(Bucket=BUCKET_NAME)
            print(f"✅ Bucket '{BUCKET_NAME}' already exists.")
        except:
            print(f"🔨 Creating bucket '{BUCKET_NAME}'...")
            if REGION == "us-east-1":
                s3.create_bucket(Bucket=BUCKET_NAME)
            else:
                s3.create_bucket(
                    Bucket=BUCKET_NAME,
                    CreateBucketConfiguration={'LocationConstraint': REGION}
                )
            print("✅ Bucket created.")

        # Disable "Block Public Access" (Required for static website hosting)
        print("🔓 Disabling 'Block Public Access'...")
        s3.delete_public_access_block(Bucket=BUCKET_NAME)
        print("✅ Public access enabled.")

        # Set Bucket Policy for Public Read (for static/media files)
        print("📜 Setting Bucket Policy...")
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{BUCKET_NAME}/*"
                }
            ]
        }
        s3.put_bucket_policy(Bucket=BUCKET_NAME, Policy=json.dumps(policy))
        print("✅ Bucket policy set to Public Read.")

        # Set CORS (Optional but good for fonts/JS)
        print("🌐 Setting CORS configuration...")
        cors_config = {
            'CORSRules': [
                {
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET'],
                    'AllowedOrigins': ['*'],
                    'ExposeHeaders': []
                }
            ]
        }
        s3.put_bucket_cors(Bucket=BUCKET_NAME, CORSConfiguration=cors_config)
        print("✅ CORS configured.")

        print("\n✨ AWS S3 Setup Complete! You are ready to deploy with Zappa.")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Tip: Make sure you have run 'aws configure' and possess AdministratorAccess.")

if __name__ == "__main__":
    try:
        import boto3
        setup_s3()
    except ImportError:
        print("❌ Error: 'boto3' library not found.")
        print("Please run: pip install boto3")
