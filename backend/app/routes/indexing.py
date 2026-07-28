from fastapi import APIRouter, HTTPException
import requests

router = APIRouter(prefix="/seo", tags=["Google Search Console & Indexing API"])

SITEMAP_URL = "https://shopgroundera.com/sitemap.xml"

@router.post("/ping-google")
def ping_google_sitemap():
    """
    Pings Google Search Console & Bing Webmaster ping APIs to request immediate re-indexing 
    of shopgroundera.com sitemap.
    """
    results = {}
    
    # 1. Ping Google Search Console
    try:
        google_url = f"https://www.google.com/ping?sitemap={SITEMAP_URL}"
        g_res = requests.get(google_url, timeout=5)
        results["google_ping"] = {
            "status_code": g_res.status_code,
            "success": g_res.status_code == 200,
            "url": google_url
        }
    except Exception as e:
        results["google_ping"] = {"success": False, "error": str(e)}

    # 2. Ping Bing Webmaster
    try:
        bing_url = f"https://www.bing.com/ping?sitemap={SITEMAP_URL}"
        b_res = requests.get(bing_url, timeout=5)
        results["bing_ping"] = {
            "status_code": b_res.status_code,
            "success": b_res.status_code == 200,
            "url": bing_url
        }
    except Exception as e:
        results["bing_ping"] = {"success": False, "error": str(e)}

    return {
        "message": "Google Search Console and Bing Webmaster Indexing Pings Dispatched",
        "sitemap": SITEMAP_URL,
        "results": results
    }
