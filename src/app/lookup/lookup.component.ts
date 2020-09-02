import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Vehicle } from './vehicle';

@Component({
  selector: 'lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})

export class LookupComponent implements OnInit {

  vin: string;
  vinData: any;

  vehicle: Vehicle;

  hideVehicleInfo: boolean = true;

  defaultHelpMessage: string = 'Enter your vehicle\'s 17-digit VIN number here.';
  helpMessage: string = this.defaultHelpMessage;

  constructor() { }

  ngOnInit(): void {
    this.vin = '';
    this.vehicle = new Vehicle;
  }

  search(){
    if(this.validate()){
      this.hideVehicleInfo = true;

      let urlBase = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/[VIN]?format=json';
      const url = urlBase.replace('[VIN]',this.vin);

      fetch(url)
        .then(response => response.json())
        .catch((error) => this.errorHandler(error))
        .then(data => {this.vinData = data; this.parsevinData()})
        .catch((error) => this.errorHandler(error));
    }
  }

  parsevinData(){
    this.vehicle = new Vehicle;
    
    //the values we're really interested in
    const focusVariables = ['Vehicle Type','Make','Model','Model Year','Manufacturer Name','Plant City','Plant State','Plant Country','Doors','Body Class','Trim','Series','Displacement (L)','Transmission Style','Fuel Type - Primary','Other Engine Info']

    //filter results only to the focus variables
    this.vinData.Results.filter(el => focusVariables.includes(el.Variable))
    .forEach(el => {
      switch(el.Variable){
        case 'Model Year':this.vehicle.modelYear = el.Value; break;    
        case 'Make':  this.vehicle.make = el.Value; break;
        case 'Model': this.vehicle.model = el.Value; break;
        case 'Vehicle Type': this.vehicle.vehicleType = el.Value; break;

        case 'Doors': this.vehicle.doors = el.Value; break;
        case 'Body Class': this.vehicle.bodyClass = el.Value; break;
        case 'Trim': this.vehicle.trim = el.Value; break;
        case 'Series': this.vehicle.series = el.Value; break;

        case 'Manufacturer Name': this.vehicle.manufacturerName = el.Value; break;
        case 'Plant City': this.vehicle.plantCity = el.Value; break;
        case 'Plant State': this.vehicle.plantState = el.Value; break;
        case 'Plant Country': this.vehicle.plantCountry = el.Value; break;

        case 'Displacement (L)': this.vehicle.displacement = el.Value; break;
        case 'Transmission Style': this.vehicle.transmissionStyle = el.Value; break;
        case 'Fuel Type - Primary': this.vehicle.fuelTypePrimary = el.Value; break;
        case 'Other Engine Info': this.vehicle.otherEngineInfo = el.Value; break;
      }
    });

    this.hideVehicleInfo = false;
  }

  validate(){
    let validVIN = true;
    this.helpMessage = this.defaultHelpMessage;
    if(this.vin.length < 17){
      validVIN = false;
      this.helpMessage = "Error: Improper Length. (17-digits).";
    }
    return validVIN;
  }

  errorHandler(error){
    console.log('Error',error);

    if(error.toString().includes('Failed to fetch') || error.toString().includes('Unexpected token')) 
      this.helpMessage = "Error: Failed to load VIN Information.";
  }
}
