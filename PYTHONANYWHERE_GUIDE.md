# Detailed Step-By-Step Guide to Deploy Django on PythonAnywhere

This guide provides exact step-by-step instructions to get your Django backend running on PythonAnywhere.

## Step 1: Push Your Code to GitHub
Before you begin, ensure your latest backend code is available on your GitHub repository.

1. Open your terminal on your computer.
2. Navigate to your project folder (`d:\Enosh\smf`).
3. Run the following commands:
```bash
git add .
git commit -m "Ready for PythonAnywhere deployment"
git push origin main
```
*(Stop here until your code is successfully pushed to GitHub).*

---

## Step 2: Set Up PythonAnywhere & Clone Repository

1. Go to [PythonAnywhere](https://www.pythonanywhere.com/) and log in (or create a free account).
2. On your Dashboard, click on **Consoles** in the top menu.
3. Under "Start a new console:", click on **Bash**.
4. In the black console window that opens, run the following command to clone your repository (replace the URL with your actual GitHub repository URL):
```bash
git clone https://github.com/yourusername/your-repo-name.git myproject
```

---

## Step 3: Set Up the Virtual Environment

Still in the same **Bash console** on PythonAnywhere, run these commands one by one:

1. Navigate to your backend directory:
```bash
cd ~/myproject/backend_django
```

2. Create a virtual environment matching PythonAnywhere's default Python version (usually 3.10):
```bash
mkvirtualenv --python=/usr/bin/python3.10 my-env
```
*(Wait for the environment to finish creating. It might take a minute).*

3. Install your project's requirements:
```bash
pip install -r requirements.txt
```

---

## Step 4: Create and Configure your `.env` File

Since your project is **Database-Free**, you only need a few simple settings in your `.env` file.

1. Still in the Bash console (in the `~/myproject/backend_django` folder), run:
```bash
nano .env
```

2. Copy and paste the following (replace `yourusername` and `your-frontend-url`):
```env
DEBUG=False
DJANGO_SECRET_KEY=seaman-fresh-stateless-prod-key-2024
ALLOWED_HOSTS=yourusername.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.netlify.app

# Stateless Admin Credentials
ADMIN_USER=admin
ADMIN_PASS=seaman123
ADMIN_SECRET_TOKEN=seaman_fresh_admin_2024
```

3. Save and exit (Ctrl + X, then Y, then Enter).

---

## Step 5: Prepare JSON Data and Collect Static Files

Since there is **No Database**, you don't need to run migrations. Instead, ensure your JSON data is in place and prepare your static files.

1. Your product and order data is stored in:
   `~/myproject/backend_django/api/data/*.json`

2. Collect the static files (required for the API and production server):
```bash
python manage.py collectstatic --noinput
```

---

## Step 6: Create the Web App in PythonAnywhere Dashboard

1. Click on the **Web** tab at the top of the PythonAnywhere page.
2. Click the button **Add a new web app**.
3. *Important:* Click **Next**, then choose **Manual configuration** (Do NOT choose Django).
4. Select **Python 3.10** (or the version you used in Step 3).
5. Click **Next** again to create the app.

---

## Step 7: Configure the Web App Settings

On the Web tab page that opens after creating your app, scroll down and configure the following:

### Virtualenv Setup
1. Scroll down to the **Virtualenv** section.
2. Enter the following path in the red text box:
```text
/home/yourusername/.virtualenvs/my-env
```
*(Replace `yourusername` with your PythonAnywhere username. Click the checkmark to save).*

### Code Location
1. Under the **Code** section, set **Source code** to:
```text
/home/yourusername/myproject/backend_django
```
2. Set **Working directory** to:
```text
/home/yourusername/myproject/backend_django
```

### Static Files
1. Scroll down to the **Static files** section.
2. Click **Enter URL** and type:
```text
/static/
```
3. Click **Enter path** and type:
```text
/home/yourusername/myproject/backend_django/staticfiles
```

---

## Step 8: Configure the WSGI File

1. Go back to the **Code** section on the Web tab.
2. Click the link next to **WSGI configuration file** (it looks like `/var/www/yourusername_pythonanywhere_com_wsgi.py`).
3. Delete **everything** in that file.
4. Copy and paste the following code (make sure to replace `yourusername`!):

```python
import os
import sys

# Replace 'yourusername' with your actual PythonAnywhere username!
path = '/home/yourusername/myproject/backend_django'
if path not in sys.path:
    sys.path.append(path)

# Load the environment variables from the .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(path, '.env'))

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

# Serve the application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```
5. Click the green **Save** button at the top right.

---

## Step 9: Launch Your Backend!

1. Go back to the **Web** tab.
2. Click the big green button at the top: **Reload yourusername.pythonanywhere.com**.
3. Once it finishes reloading, open your site: `https://yourusername.pythonanywhere.com/api/` to verify it's working!

*Next steps: Remember to update your frontend code to use your new PythonAnywhere URL as its API URL, then deploy your frontend to Netlify.*
