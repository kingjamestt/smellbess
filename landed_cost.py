"""Landed-cost + decant economics calculator (Websource -> Trinidad, full-value declaration).

Calibrated to the Websource quote: US$50 item, 1 lb -> US$30.47 in fees.
  CIF      = item + freight (4.97/lb)
  Duty     = 20% of CIF        (HS 3303 perfume)
  OPT      = 7% of CIF         (online purchase tax)
  VAT      = 12.5% of (CIF + duty + OPT)
  Fixed    = freight 4.97 + fuel 0.84 + insurance 1.00 per lb, + 0.09 VAT on local handling
"""
import math

FX = 6.82
FREIGHT, FUEL, INS = 4.97, 0.84, 1.00
DUTY, OPT, VAT = 0.20, 0.07, 0.125

def fees_usd(item, lbs):
    lbs = math.ceil(lbs)              # assume billed per whole lb (CONFIRM with Websource)
    cif = item + FREIGHT * lbs
    duty, opt = DUTY * cif, OPT * cif
    vat = VAT * (cif + duty + opt)
    return duty + opt + vat + (FREIGHT + FUEL + INS) * lbs + 0.09

def landed_usd(item, lbs=1):
    return item + fees_usd(item, lbs)

def landed_ttd(item, lbs=1):
    return landed_usd(item, lbs) * FX

MIAMI_TAX = 0.07                      # Jomashop charges Miami-Dade sales tax
def jomashop_order(items_usd, lbs):
    """Landed USD for one Jomashop order: 7% tax, $6 shipping under $100.
    Assumes Websource declares the invoice total incl. tax (conservative; CONFIRM)."""
    invoice = items_usd * (1 + MIAMI_TAX) + (0 if items_usd >= 100 else 6)
    return invoice + fees_usd(invoice, lbs)

if __name__ == "__main__":
    print("Item  Fees  Fee%  LandedUSD  LandedTTD  /ml(100ml, 95 usable)")
    for p in (25, 50, 80, 120):
        f = fees_usd(p, 1)
        print(f"{p:>4} {f:6.2f} {f/p:5.0%} {p+f:9.2f} {landed_ttd(p):10.0f} {landed_ttd(p)/95:8.2f}")
    print("\nConsolidation: 3 x 1.4 lb bottles @ $30")
    single = 3 * landed_usd(30, 1.4)
    combo = 3 * 30 + fees_usd(90, 4.2)
    print(f"  separate {single:.2f}  consolidated {combo:.2f}  saving/bottle {(single-combo)/3:.2f}")
