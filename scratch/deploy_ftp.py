import os
import subprocess
import ftplib
import sys

# Configuration
LOCAL_DIR = os.path.abspath("apps/web/out")
FTP_SERVER = "89.116.133.132"
FTP_USER = "u505146222.fuelupeducation.com"
FTP_PASS = "Fuelup@786"
REMOTE_ROOT = "/public_html"

def run_build():
    print("--- 1. Building Next.js Web Frontend Statically ---")
    api_url = "http://localhost:8000"
    
    # Try to read localtunnel URL if it is running
    log_path = os.path.join("scratch", "localtunnel.log")
    if os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8") as f:
                content = f.read()
                for line in content.splitlines():
                    if "your url is:" in line:
                        api_url = line.split("your url is:")[-1].strip()
                        print(f"Detected active localtunnel secure URL: {api_url}")
                        break
        except Exception as e:
            print("Failed to read localtunnel log, using default:", e)
            
    print(f"Building frontend with NEXT_PUBLIC_API_URL = {api_url}")
    env = os.environ.copy()
    env["NEXT_PUBLIC_API_URL"] = api_url
    
    result = subprocess.run(
        ["npm", "run", "build", "-w", "web-frontend"],
        shell=True,
        env=env,
        capture_output=False
    )
    if result.returncode != 0:
        print("Error: Build failed!")
        sys.exit(1)
    print("Build successful!\n")

def upload_directory(ftp, local_dir, remote_dir):
    print(f"Syncing local directory: {local_dir} to remote: {remote_dir}")
    
    # Try to make remote directory
    try:
        ftp.mkd(remote_dir)
        print(f"Created remote directory: {remote_dir}")
    except ftplib.error_perm as e:
        # Directory might already exist
        pass

    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}" if remote_dir != "/" else f"/{item}"
        
        if os.path.isdir(local_path):
            upload_directory(ftp, local_path, remote_path)
        else:
            print(f"Uploading file: {remote_path} ... ", end="", flush=True)
            try:
                with open(local_path, "rb") as f:
                    ftp.storbinary(f"STOR {remote_path}", f)
                print("OK")
            except Exception as ex:
                print("FAILED:", ex)

def main():
    # 1. Run local build
    run_build()
    
    # 2. Connect and Upload
    print("--- 2. Connecting to Hostinger FTP ---")
    try:
        ftp = ftplib.FTP(FTP_SERVER)
        ftp.login(FTP_USER, FTP_PASS)
        print("Connected and logged in successfully!")
        
        # Navigate to public_html root
        ftp.cwd(REMOTE_ROOT)
        print("FTP root changed to:", ftp.pwd())
        
        # Start recursive upload
        print("\n--- 3. Uploading Static Assets ---")
        upload_directory(ftp, LOCAL_DIR, ".")
        
        ftp.quit()
        print("\nDeployment complete successfully!")
    except Exception as e:
        print("FTP Deployment Error:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
