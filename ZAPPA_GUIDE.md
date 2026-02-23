# Serverless Deployment Guide (AWS Lambda + Zappa)

This guide explains how to deploy the **Seaman Fresh** backend to AWS Lambda using Zappa.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **AWS CLI**: Installed and configured with `aws configure`.
    - Access Key ID
    - Secret Access Key
    - Region (e.g., `us-east-1`)
3.  **Python Virtual Environment**: Zappa **must** be installed in a virtual environment.

## Step 1: Create AWS Resources (Easy Mode)

Instead of manual setup, just run the automation script I created for you:

1.  Make sure you have `boto3` installed:
    ```bash
    pip install boto3
    ```
2.  Run the setup script:
    ```bash
    python scripts/setup_aws.py
    ```

This script will automatically:
- Create the S3 bucket `zappa-seaman-fresh-deployments`.
- Configure it for public read access (required for static files).
- Set CORS policies.

*(If you prefer manual setup, you can still use the AWS Console to create the bucket and uncheck "Block Public Access".)*

## Step 2: Configure Settings (ALREADY DONE)

I have already pre-filled `backend_django/zappa_settings.json` with:
- **Database URL**: Your existing Neon database from the `.env` file.
- **Secret Key**: A generated production-ready key.
- **S3 Bucket**: `zappa-seaman-fresh-deployments`.

**Action Required**:
1.  Ensure you create the S3 bucket named `zappa-seaman-fresh-deployments` in your AWS console (or change the name in `zappa_settings.json` if you prefer a different one).
2.  The bucket must allow public read access for static files (uncheck "Block all public access").

## Step 3: Deploy

1.  Activate your virtual environment.
2.  Install dependencies:
    ```bash
    pip install -r backend_django/requirements.txt
    ```
3.  Navigate to the backend folder:
    ```bash
    cd backend_django
    ```
4.  Deploy to the `dev` stage:
    ```bash
    zappa deploy dev
    ```

## Step 4: Post-Deployment

1.  **Migrate Database**:
    After deployment, run the migrations on the Lambda function:
    ```bash
    zappa manage dev migrate
    ```
2.  **Collect Static Files**:
    Upload static files to your S3 bucket:
    ```bash
    zappa manage dev collectstatic
    ```
3.  **Create Superuser**:
    ```bash
    zappa invoke dev "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'password')"
    ```

## Step 5: Updates

To update the code after making changes:
```bash
zappa update dev
```
