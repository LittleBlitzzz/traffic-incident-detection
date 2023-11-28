
import React, { useState, useEffect } from 'react';
import { Dropdown, ImageFromBackend } from './';

interface AnnotatorInterfaceProps {
  datasetName: string;
  videoName: string;
  imageFileName: string;
}

const AnnotatorInterface: React.FC<AnnotatorInterfaceProps> = ({ 
    datasetName, 
    videoName, 
    imageFileName 
  }) => {
  
  const annotationsData = {
    environment_details: {
      road_details: {
        location: '',
        type_of_road: '',
        surroundings: [],
        road_layout: '',
      },
      time_of_day: '',
      weather: '',
      lighting: '',
      traffic_density: '',
    },
    traffic_participants: {
      motor_vehicles: {
        cars: '',
        trucks_large_vehicles: '',
        motorcycles_rickshaws: '',
      },
      cyclists: '',
      pedestrians: '',
    },
    traffic_incident: {
      timing: '',
      collision_with_others: false,
      type_of_collision: {
        type: '',
        involvement: '',
      },
      rollover_accident: false,
      run_off_road_accident: false,
      chain_accident: false,
    },
    potential_cause_of_incident: [],
  };

  const unableToIdentifyOption = "Unknown/Indistinguishable";
  const objectVolumeOptions = [ "None", "At least one", "A few", "Multiple" ];
  
  const handleFormSubmission = (e) => {
    e.preventDefault();
    console.log(document.forms.Testing);
    console.log(e.target.road_location.value);
  };

  return (
    <>
      <div className="w-10"></div>
      <div className="flex flex-col">
        <form onSubmit={handleFormSubmission} id="Testing">
          <p>Environment details:</p>
            <p className="ml-2">Road details:</p>
              <DropdownWithLabel 
                dropdown={{
                  options:[ "Urban", "Suburban", "Rural", unableToIdentifyOption ],
                  title:"Road Location",
                  inputValueName:"road_location",
                  initialValue:"Urban"
                }}
                label="Road Location"
              />

              <DropdownWithLabel 
                dropdown={{
                  options:[ "Highway", "Street", "Alley", unableToIdentifyOption ],
                  title:"Type of Road",
                  inputValueName:"road_type",
                  initialValue:"Highway"
                }}
                label="Type of Road"
              />


              <p className="ml-4">Road layout:</p>
              <Dropdown
                options={[ "Straight Road", "Curved Road", "T-Junction", "Y-Juntion", "Four-way Junction", "Roundabout", unableToIdentifyOption ]}
                title='Road Layout'
              />
              <p className="ml-4">Surroundings:</p>
            <p className="ml-2">Time of Day:</p>
              <Dropdown
                options={[ 'Dawn/Dusk', 'Daytime', 'Night', unableToIdentifyOption ]}
                title='Time of Day'
              />
            <p className="ml-2">Weather Conditions:</p>
              <Dropdown
                options={[ 'Clear', 'Raining', 'Snowing', unableToIdentifyOption ]}
                title='Weather'
              />
            <p className="ml-2">Lighting Conditions:</p>
              <Dropdown
                options={[ 'Daylight', 'Low light', 'Street lights', unableToIdentifyOption ]}
                title='Lighting Conditions'
              />
            <p className="ml-2">Traffic Density:</p>
              <Dropdown
                options={[ 'Empty', 'Sparse', 'Moderate', 'Dense' ]}
                title='Traffic Density'
              />
          <p>Traffic Participants:</p>
            <p className="ml-2">Motor Vehicles:</p>
              <p className="ml-4">Cars:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Cars'
              />
              <p className="ml-4">Trucks/Large Vehicles:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Trucks/Large Vehicles'
              />
              <p className="ml-4">Motorcycles/Rickshaws:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Motorcycles'
              />
            <p className="ml-2">Cyclists:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Cyclists'
              />
            <p className="ml-2">Pedestrians:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Pedestrians'
              />
          <input type="submit" value="Hello "/>
        </form>
      </div>
    </>
  )
}

export default AnnotatorInterface;



const DropdownWithLabel = ({ dropdown, label } : { dropdown : DropdownProps, label: string}) => {
  return (
    <>
      <div className="flex items-center py-2">
        <p className="ml-4 w-40">{label}:</p>
        <Dropdown
          options={dropdown.options}
          title={dropdown.title}
          inputValueName={dropdown.inputValueName}
          initialValue={dropdown.initialValue}
        />
      </div>
    </>
  )
}