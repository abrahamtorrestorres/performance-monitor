from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

# --- CREDENTIALS ---
# Ensure these match what your app expects!
APP_USERNAME = "admin"
APP_PASSWORD = "admin" 
# -------------------

@pytest.fixture
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.binary_location = "/usr/bin/chromium"
    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=chrome_options)
    yield driver
    driver.quit()

def test_dashboard_metrics(driver):
    url = "http://localhost:3001"
    print(f"\nNavigating to {url}...")
    driver.get(url)
    wait = WebDriverWait(driver, 15)

    # --- STEP 1: LOGIN ---
    try:
        # Check if we are on the login page by looking for the username box
        if len(driver.find_elements(By.ID, "username")) > 0:
            print("🔒 Login Page detected. Logging in...")
            
            # FIXED: Using By.ID based on your HTML dump
            driver.find_element(By.ID, "username").clear()
            driver.find_element(By.ID, "username").send_keys(APP_USERNAME)
            
            driver.find_element(By.ID, "password").clear()
            driver.find_element(By.ID, "password").send_keys(APP_PASSWORD)
            
            # FIXED: Click the button specifically containing "Sign In" text
            login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
            login_btn.click()
            print("✅ Clicked Sign In")
        else:
            print("ℹ️ No login fields found. assuming already logged in.")

    except Exception as e:
        print(f"⚠️ Login Warning: {e}")

    # --- STEP 2: VERIFY DATA ---
    try:
        print("Waiting for Real-Time Data...")
        
        # Wait for the CPU element to contain the '%' symbol
        wait.until(EC.text_to_be_present_in_element((By.ID, "stat-cpu"), "%"))
        
        element = driver.find_element(By.ID, "stat-cpu")
        cpu_value = element.text
        print(f"✅ Data Detected: {cpu_value}")
        
        assert "%" in cpu_value
        print("🎉 TEST PASSED: Dashboard is receiving live data.")

    except Exception as e:
        print(f"\n❌ FAILED. Dumping Page Text for debugging:")
        print(driver.find_element(By.TAG_NAME, "body").text[:300])
        raise e
