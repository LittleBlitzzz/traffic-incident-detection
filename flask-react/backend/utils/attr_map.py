
class AttrMap(dict):
  """
  Shamelessly borrowed from https://stackoverflow.com/questions/2352181/how-to-use-a-dot-to-access-members-of-dictionary
  Example:
  m = AttrMap({'first_name': 'Eduardo'}, last_name='Pool', age=24, sports=['Soccer'])
  """
  def __init__(self, *args, **kwargs):
    super(AttrMap, self).__init__(*args, **kwargs)
    for arg in args:
      if isinstance(arg, dict):
        for k, v in arg.items():
          if isinstance(v, dict):
            self[k] = AttrMap(v)
          else:
            self[k] = v

    if kwargs:
      for k, v in kwargs.items():
        if isinstance(v, dict):
          self[k] = AttrMap(v)
        else:
          self[k] = v

  def __getattr__(self, attr):
    return self.get(attr)

  def __setattr__(self, key, value):
    self.__setitem__(key, value)

  def __setitem__(self, key, value):
    super(AttrMap, self).__setitem__(key, value)
    self.__dict__.update({key: value})

  def __delattr__(self, item):
    self.__delitem__(item)

  def __delitem__(self, key):
    super(AttrMap, self).__delitem__(key)
    del self.__dict__[key]

  def __str__(self):
    return self.__dict__.__str__()

  def __repr__(self):
    return self.__dict__.__repr__()

  def apply_dictionary_values(self, targetDict):
    for k, v in targetDict.items():
      if v is not None:
        if self.get(k, None) is not None:
          if isinstance(k, dict):
            self.apply_dictionary_values(self[k], v)
          else:
            self[k] = v