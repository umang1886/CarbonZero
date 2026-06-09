"""
CarbonZero — Footprint Calculation Service

Provides pure business-logic functions for computing CO₂e emissions
from IPCC-validated emission factors. Isolated from Flask for testability.
"""
from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)

# ── IPCC-validated emission factors (AR6 / IEA 2023) ─────────────────────────
EMISSION_FACTORS: dict[str, Any] = {
    "transport": {
        "car_petrol_km_week": 0.21,    # kg CO2e per km
        "car_electric_km_week": 0.07,  # kg CO2e per km (India grid)
        "flights_per_year": 1800 * 0.255,  # kg CO2e per return flight (medium-haul)
        "bus_km_week": 0.089,          # kg CO2e per km
        "train_km_week": 0.035,        # kg CO2e per km
    },
    "diet": {
        "vegan": 1500,        # kg CO2e per year
        "vegetarian": 1700,
        "omnivore": 2500,
        "heavy_meat": 3300,
    },
    "energy": {
        "electricity_kwh_month": 0.82,  # kg CO2e per kWh (India grid factor IEA 2023)
        "natural_gas_m3_month": 2.04,   # kg CO2e per m3
    },
    "shopping": {
        "clothing_items_year": 12.0,    # kg CO2e per item
        "electronics_per_year": 70.0,   # kg CO2e per device
    },
}

VALID_DIET_TYPES = frozenset(EMISSION_FACTORS["diet"].keys())
DEFAULT_DIET = "omnivore"

# ── Input validation limits ───────────────────────────────────────────────────
MAX_VALUES: dict[str, float] = {
    "carPetrolKmWeek": 10_000,
    "carElectricKmWeek": 10_000,
    "flightsPerYear": 365,
    "busKmWeek": 10_000,
    "trainKmWeek": 10_000,
    "electricityKwhMonth": 100_000,
    "naturalGasM3Month": 10_000,
    "clothingItemsYear": 10_000,
    "electronicsPerYear": 1_000,
}


def _clamp(value: float, field: str) -> float:
    """Clamp a numeric value to [0, MAX_VALUES[field]]."""
    return max(0.0, min(float(value), MAX_VALUES.get(field, 1e9)))


def validate_numeric_input(data: dict[str, Any], field: str, default: float = 0.0) -> float:
    """Extract and validate a non-negative numeric field from a dictionary.

    Args:
        data:    Source dictionary.
        field:   Key to extract.
        default: Value to use when the key is missing.

    Returns:
        A validated, clamped float value.

    Raises:
        ValueError: If the value cannot be coerced to a float.
    """
    raw = data.get(field, default)
    try:
        return _clamp(float(raw), field)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Field '{field}' must be a number, got {raw!r}") from exc


def calculate_transport(transport: dict[str, Any]) -> float:
    """Calculate annual transport CO₂e emissions in kg.

    Args:
        transport: Dictionary with weekly/yearly transport activity data.

    Returns:
        Annual kg CO₂e from transport.
    """
    f = EMISSION_FACTORS["transport"]
    car_petrol  = validate_numeric_input(transport, "carPetrolKmWeek")
    car_electric = validate_numeric_input(transport, "carElectricKmWeek")
    flights     = validate_numeric_input(transport, "flightsPerYear")
    bus         = validate_numeric_input(transport, "busKmWeek")
    train       = validate_numeric_input(transport, "trainKmWeek")

    return (
        car_petrol   * 52 * f["car_petrol_km_week"]
        + car_electric * 52 * f["car_electric_km_week"]
        + flights      * f["flights_per_year"]
        + bus          * 52 * f["bus_km_week"]
        + train        * 52 * f["train_km_week"]
    )


def calculate_energy(energy: dict[str, Any]) -> float:
    """Calculate annual energy CO₂e emissions in kg.

    Args:
        energy: Dictionary with monthly energy consumption data.

    Returns:
        Annual kg CO₂e from energy use.
    """
    f = EMISSION_FACTORS["energy"]
    electricity = validate_numeric_input(energy, "electricityKwhMonth")
    gas         = validate_numeric_input(energy, "naturalGasM3Month")

    return (
        electricity * 12 * f["electricity_kwh_month"]
        + gas         * 12 * f["natural_gas_m3_month"]
    )


def calculate_shopping(shopping: dict[str, Any]) -> float:
    """Calculate annual shopping CO₂e emissions in kg.

    Args:
        shopping: Dictionary with yearly shopping activity data.

    Returns:
        Annual kg CO₂e from shopping.
    """
    f = EMISSION_FACTORS["shopping"]
    clothing    = validate_numeric_input(shopping, "clothingItemsYear")
    electronics = validate_numeric_input(shopping, "electronicsPerYear")

    return (
        clothing    * f["clothing_items_year"]
        + electronics * f["electronics_per_year"]
    )


def get_diet_emissions(diet_type: str) -> float:
    """Look up annual diet CO₂e emissions in kg.

    Args:
        diet_type: One of 'vegan', 'vegetarian', 'omnivore', 'heavy_meat'.

    Returns:
        Annual kg CO₂e from diet.
    """
    if diet_type not in VALID_DIET_TYPES:
        logger.warning("Unknown diet type '%s', defaulting to '%s'.", diet_type, DEFAULT_DIET)
        diet_type = DEFAULT_DIET
    return float(EMISSION_FACTORS["diet"][diet_type])


def compute_footprint(data: dict[str, Any]) -> dict[str, Any]:
    """Compute the complete carbon footprint from a user's lifestyle data.

    Args:
        data: Validated request payload containing transport, dietType,
              energy, and shopping sub-dicts.

    Returns:
        A result dict with total_kg_co2e, breakdown, and comparison keys.

    Raises:
        ValueError: If any numeric input field is invalid.
    """
    transport = calculate_transport(data.get("transport", {}))
    diet      = get_diet_emissions(data.get("dietType", DEFAULT_DIET))
    energy    = calculate_energy(data.get("energy", {}))
    shopping  = calculate_shopping(data.get("shopping", {}))

    total = transport + diet + energy + shopping

    return {
        "total_kg_co2e": round(total),
        "breakdown": {
            "transport": round(transport),
            "diet":      round(diet),
            "energy":    round(energy),
            "shopping":  round(shopping),
        },
        "comparison": {
            "india_avg":    1900,
            "global_avg":   4800,
            "paris_target": 2000,
        },
    }
