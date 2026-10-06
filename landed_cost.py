"""Landed-cost + decant economics calculator (Websource -> Trinidad, full-value declaration).

Calibrated to a real Websource invoice (6 Aug 2026, Fashion Nova, 10 lb, TT$562.75),
which it reproduces to the cent. The older version used Websource's published quote
(US$4.97/lb freight, US$1/lb insurance) and overstated fees by about 2x.

  Freight   = US$3.26/lb (TT$22.23/lb), billed per whole lb   <- invoice
  Fuel      = 17% of freight                                   <- invoice
  Insurance = US$1.00 per shipment, not per lb                 <- invoice
  CIF       = declared value (+ freight if FREIGHT_IN_CIF)
  Duty      = 20% of CIF   (perfume HS 3303; apparel was also 20% on the invoice)
  OPT       = 7% of CIF    (online purchase tax)
  VAT       = 12.5% of (CIF + duty + OPT)
  + US$0.09 VAT on local handling

The invoice taxed a CIF of TT$688.40 (US$100.94) on an order listed at US$199.97.
That fits either "goods US$68.34 + freight" or "goods US$100.94, freight left out".
FREIGHT_IN_CIF picks between them; True is the dearer, conservative reading.
CONFIRM with the amount actually paid to Fashion Nova.
"""
import math

FX = 6.82
FREIGHT_PER_LB = 3.26
FUEL_RATE = 0.17
INSURANCE_PER_SHIPMENT = 1.00
LOCAL_HANDLING_VAT = 0.09
DUTY, OPT, VAT = 0.20, 0.07, 0.125
FREIGHT_IN_CIF = True


def fees_usd(declared, lbs, freight_in_cif=FREIGHT_IN_CIF):
    """Websource fees in USD for one shipment (all packages consolidated)."""
    lbs = math.ceil(lbs)              # billed per whole lb (matches the invoice)
    freight = FREIGHT_PER_LB * lbs
    cif = declared + (freight if freight_in_cif else 0)
    duty, opt = DUTY * cif, OPT * cif
    vat = VAT * (cif + duty + opt)
    return duty + opt + vat + freight * (1 + FUEL_RATE) + INSURANCE_PER_SHIPMENT + LOCAL_HANDLING_VAT


def landed_usd(item, lbs=1):
    return item + fees_usd(item, lbs)


def landed_ttd(item, lbs=1):
    return landed_usd(item, lbs) * FX


MIAMI_TAX = 0.07                      # Jomashop charges Miami-Dade sales tax (also on shipping)
def jomashop_order(items_usd, lbs):
    """Landed USD for one Jomashop order: 7% tax, US$5.99 shipping under US$100.
    Assumes Websource declares the invoice total incl. tax (conservative; CONFIRM)."""
    shipping = 0 if items_usd >= 100 else 5.99
    invoice = (items_usd + shipping) * (1 + MIAMI_TAX)
    return invoice + fees_usd(invoice, lbs)


def per_bottle_ttd(prices_usd, lbs_per_bottle=1.25):
    """Landed TTD per bottle for one Jomashop order, fees shared by value."""
    items = sum(prices_usd.values())
    total = jomashop_order(items, lbs_per_bottle * len(prices_usd))
    return {k: v / items * total * FX for k, v in prices_usd.items()}


if __name__ == "__main__":
    inv = fees_usd(68.34, 10) * FX
    print(f"Invoice check (Fashion Nova, 10 lb): TT${inv:.2f} vs actual TT$562.75\n")
    print("Single bottle, shipped alone (1 lb):")
    print("Item  Fees  Fee%  LandedUSD  LandedTTD  /ml(95 usable)")
    for p in (25, 35, 50, 80):
        f = fees_usd(p * 1.07, 1)
        print(f"{p:>4} {f:6.2f} {f/p:5.0%} {p*1.07+f:9.2f} {(p*1.07+f)*FX:10.0f} {(p*1.07+f)*FX/95:8.2f}")
