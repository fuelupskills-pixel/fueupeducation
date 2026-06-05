import ftplib

server = "89.116.133.132"
username = "u505146222.fuelupeducation.com"
password = "Fuelup@786"

try:
    print(f"Connecting to FTP server {server}...")
    ftp = ftplib.FTP(server)
    print("Logging in...")
    ftp.login(username, password)
    print("Login successful!")
    print("Current directory:", ftp.pwd())
    print("Files in current directory:")
    ftp.retrlines('LIST')
    ftp.quit()
except Exception as e:
    print("FTP Error:", e)
