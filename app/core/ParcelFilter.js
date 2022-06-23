// Helper function to calculate distance and minutes between two geolocation points.
export const getDistance = async (orig, dest, mode) => {
  let dist = 0;
  let mins = 0;

  if (orig && dest) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${
      orig.latitude
    },${orig.longitude}&destinations=${dest.latitude},${dest.longitude}&mode=${
      mode == 0 ? "bicycling" : "driving"
    }&units=imperial&key=AIzaSyCE2Ct-iHuI_2nNALaRghtfpNBj1gPhfcY`;

    const res = await fetch(url);

    const data = await res.json();

    dist = data.rows[0].elements[0].distance
      ? parseFloat(
          data.rows[0].elements[0].distance.text.replace(",", "").split(" ")[0]
        )
      : -1;

    mins =
      dist >= 0 ? Math.round(data.rows[0].elements[0].duration.value / 60) : -1;
  }

  return { dist, mins };
};

const dimensionsAcceptable = (
  {
    length: parcelLength,
    width: parcelWidth,
    height: parcelHeight,
    weight: parcelWeight,
  },
  {
    length: driverLength,
    width: driverWidth,
    height: driverHeight,
    weight: driverWeight,
  }
) => {
  const parcelDimensions = [parcelLength, parcelWidth, parcelHeight];
  parcelDimensions.sort((a, b) => a - b).reverse();

  const driverDimensions = [driverLength, driverWidth, driverHeight];
  driverDimensions.sort((a, b) => a - b).reverse();

  return (
    (!driverDimensions[0] || driverDimensions[0] >= parcelDimensions[0]) &&
    (!driverDimensions[1] || driverDimensions[1] >= parcelDimensions[1]) &&
    (!driverDimensions[2] || driverDimensions[2] >= parcelDimensions[2]) &&
    (!driverWeight || driverWeight >= parcelWeight)
  );
};

const distanceAcceptable = async (
  driverProfile,
  currentLocation,
  pickup,
  dropoff
) => {
  const baseLocation = driverProfile.showNearbyOrders
    ? currentLocation
    : driverProfile.centerAddress.location;

  const { dist: distToPickup, mins: minsToPickup } = await getDistance(
    baseLocation,
    pickup,
    driverProfile.vehicle
  );
  const { dist: distToDest, mins: minsToDest } = await getDistance(
    baseLocation,
    dropoff,
    driverProfile.vehicle
  );

  return (
    0 <= distToPickup &&
    distToPickup <= driverProfile.radius &&
    0 <= distToDest &&
    distToDest <= driverProfile.radius
  );
};

export const canTakeParcel = async (
  driverDoc,
  driverProfile,
  currentLocation
) => {
  return (
    dimensionsAcceptable(driverDoc.dimensions, driverProfile) &&
    (await distanceAcceptable(
      driverProfile,
      currentLocation,
      driverDoc.pickup.location,
      driverDoc.dropoff.location
    ))
  );
};
