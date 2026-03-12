/* Helper functions for checking the status of service items. */

import type { Maintenance } from '../types/maintenance';

export function checkServiceItemsStatus(
  item: Maintenance,
  selectedBike: string,
) {
  if (item.date !== null && item.odo !== null && item.bike_id === selectedBike)
    return item;
}
