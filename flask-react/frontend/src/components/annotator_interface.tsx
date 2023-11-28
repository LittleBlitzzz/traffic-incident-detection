
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
                  inputValueName:"road_location",
                }}
                label="Road Location"
                indentClass="ml-4"
              />

              <DropdownWithLabel 
                dropdown={{
                  options:[ "Highway", "Street", "Alley", unableToIdentifyOption ],
                  inputValueName:"road_type",
                }}
                label="Type of Road"
                indentClass="ml-4"
              />

              <DropdownWithLabel 
                dropdown={{
                  options:[ "Straight Road", "Curved Road", "T-Junction", "Y-Juntion", "Four-way Junction", "Roundabout", unableToIdentifyOption ],
                  inputValueName:"road_layout",
                }}
                label="Road Layout"
                indentClass="ml-4"
              />

              <p className="ml-4">Surroundings:</p>
              

            <DropdownWithLabel 
              dropdown={{
                options={[ 'Dawn/Dusk', 'Daytime', 'Night', unableToIdentifyOption ]},
                inputValueName:"time_of_day",
              }}
              label="Time of Day"
              indentClass="ml-2"
            />
              
          <input type="submit" value="Hello "/>
        </form>
      </div>
    </>
  )
}

export default AnnotatorInterface;



const DropdownWithLabel = ({ dropdown, label, indentClass } : { dropdown : DropdownProps, label: string, indentClass:string}) => {
  dropdown.initialValue = dropdown.options[0]
  return (
    <>
      <div className="flex items-center py-2">
        <p className="{indentClass} w-40">{label}:</p>
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