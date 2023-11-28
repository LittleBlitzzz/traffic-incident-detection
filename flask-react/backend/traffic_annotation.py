import yaml
import os

from utils.attr_map import AttrMap

class TrafficAnnotation:
  def __init__(self):
    self.annotations = AttrMap({
      'environment_details': {
        'road_details': {
          'location': '',
          'type_of_road': '',
          'surroundings': [],
          'road_layout': ''
        },
        'time_of_day': '',
        'weather': '',
        'lighting': '',
        'traffic_density': ''
      },
      'traffic_participants': {
        'motor_vehicles': {
          'cars': '',
          'trucks_large_vehicles': '',
          'motorcycles_rickshaws': ''
        },
        'cyclists': '',
        'pedestrians': ''
      },
      'traffic_incident': {
        'timing': '',
        'collision_with_others': False,
        'type_of_collision': {
          'type': '',
          'involvement': ''
        },
        'rollover_accident': False,
        'run_off_road_accident': False,
        'chain_accident': False
      },
      'potential_cause_of_incident': []
    })
    self.video_metadata = AttrMap({})

  def save_to_file(self, file_path):
    data = yaml.safe_load(str({
      "annotations": self.annotations,
      "video_metadata": self.video_metadata
    }))
    with open(file_path, 'w') as data_file:
      yaml.dump(data, data_file, default_flow_style=False)

  def read_from_file(self, file_path):
    if os.path.exists(file_path):
      with open(file_path, 'r') as data_file:
        data = yaml.safe_load(data_file) 
        # check non empty
        if data:
          self.annotations = AttrMap(data["annotations"])
          self.video_metadata = AttrMap(data["video_metadata"])
          return True
    
    return False

  def __str__(self):
    return self.__dict__.__str__()

  def __repr__(self):
    return self.__dict__.__repr__()

# Example usage:
# annotations = TrafficAnnotation()
# annotations.annotations.environment_details.road_details.location = 'Urban'
# annotations.save_to_file('sample_annotation.yaml')
# annotations.read_from_file('sample_annotation.yaml')
# print(annotations.annotations)
