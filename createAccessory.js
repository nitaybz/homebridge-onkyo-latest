//Credit: https://github.com/nfarina/homebridge/blob/master/lib/server.js#L425
function createAccessory(
  accessoryInstance,
  { hap: { Service, Accessory, Characteristic, uuid }, platformAccessory }
) {
  const services = accessoryInstance.getServices();
  // The returned "services" for this accessory are simply an array of new-API-style
  // Service instances which we can add to a created HAP-NodeJS Accessory directly.

  const accessoryUUID = uuid.generate(accessoryInstance.name + 'receiver');

  const accessory = new platformAccessory(accessoryInstance.name, accessoryUUID, Accessory.Categories.AUDIO_RECEIVER);

  // listen for the identify event if the accessory instance has defined an identify() method
  if (accessoryInstance.identify)
    accessory.on('identify', function(paired, callback) {
      accessoryInstance.identify(callback);
    });

  services.forEach(service => {
    if (service instanceof Service.AccessoryInformation) {
      const existingService = accessory.getService(
        Service.AccessoryInformation
      );

      // pull out any values you may have defined
      const manufacturer = service.getCharacteristic(
        Characteristic.Manufacturer
      ).value;
      const model = service.getCharacteristic(Characteristic.Model).value;
      const serialNumber = service.getCharacteristic(
        Characteristic.SerialNumber
      ).value;

      if (manufacturer)
        existingService.setCharacteristic(
          Characteristic.Manufacturer,
          manufacturer
        );
      if (model) existingService.setCharacteristic(Characteristic.Model, model);
      if (serialNumber)
        existingService.setCharacteristic(
          Characteristic.SerialNumber,
          serialNumber
        );
    } else 
      accessory.addService(service)
  });

  return accessory;
}

module.exports = createAccessory;
