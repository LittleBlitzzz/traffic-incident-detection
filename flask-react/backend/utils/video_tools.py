
import os
import cv2
import json

from pathlib import Path
from base64 import b64encode
from natsort import natsorted

from moviepy.editor import VideoFileClip

def convert_avi_to_mp4(input_file, output_file):
    clip = VideoFileClip(input_file)
    clip.write_videofile(output_file, codec='libx264', audio_codec='aac')

# Example usage
# input_file = 'downloaded.avi'
# output_file = 'output.mp4'
# convert_avi_to_mp4(input_file, output_file)

def cut_video_frames(input_file, output_file, start_frame, end_frame):
    cap = cv2.VideoCapture(input_file)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file, fourcc, fps, (frame_width, frame_height))

    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    while cap.isOpened() and start_frame <= end_frame:
        ret, frame = cap.read()
        if not ret:
            break
        out.write(frame)
        start_frame += 1

    cap.release()
    out.release()

# Example usage
# input_file = 'output.mp4'
# output_file = 'output_sliced.mp4'
# start_frame = 100  # Start frame index
# end_frame = 200  # End frame index

# cut_video_frames(input_file, output_file, start_frame, end_frame)

def sort_image_files_in_dir(folder_path):
  image_file_paths = [os.path.join(folder_path, f) for f in natsorted(os.listdir(folder_path)) if f.endswith(('.jpg', '.jpeg', '.png'))]
  if not image_file_paths:
      print("No image files found in the folder.")
      return []
  return image_file_paths

def image_paths_to_video(image_file_paths, output_folder, output_file_title):
  Path(output_folder).mkdir(parents=True, exist_ok=True)

  # Get the dimensions of the first image
  first_image_path = image_file_paths[0]
  first_image = cv2.imread(first_image_path)
  height, width, _ = first_image.shape

  # Define the video writer
  output_path = os.path.join(output_folder, output_file_title) + ".mp4"
  fourcc = cv2.VideoWriter_fourcc(*'mp4v')
  video_writer = cv2.VideoWriter(output_path, fourcc, 20.0, (width, height))

  # Write each image to the video
  counter = 0
  for image_path in image_file_paths:
    if counter % 100 == 0:
      print("Processing frame : ", counter)

    image = cv2.imread(image_path)
    video_writer.write(image)

    # Release the video writer and destroy any remaining windows
  video_writer.release()
  cv2.destroyAllWindows()

  print(f"Video created successfully at {output_path}")

def images_to_video(folder_path, output_folder, output_file_title, start_frame = 0, end_frame = -1):
  if start_frame < 0:
    print("Invalid frame range.")
    return False
  if end_frame > 0 and 0 and (end_frame < start_frame):
    print("Invalid frame range.")
    return False

  image_file_paths = sort_image_files_in_dir(folder_path)

  if end_frame > 0 and end_frame > len(image_file_paths):
    print("Invalid frame range.")
    return False
  return image_paths_to_video(image_file_paths[start_frame:end_frame], output_folder, output_file_title)

# Example usage
# folder_path = '/content/images'
# output_folder = '/content/output'
# output_file_title = 'video'
# start_frame = 100  # Start frame index
# end_frame = 200  # End frame index

# images_to_video(folder_path, output_folder, output_file_title, start_frame, end_frame)


def extract_frames(video_path, output_folder, start_time, end_time, num_frames):
    capture = cv2.VideoCapture(video_path)
    fps = capture.get(cv2.CAP_PROP_FPS)
    start_frame = int(start_time * fps)
    end_frame = int(end_time * fps)
    frame_interval = max(1, int((end_frame - start_frame) / num_frames))

    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    frame_count = 0
    current_frame = start_frame

    while current_frame < end_frame and frame_count < num_frames:
        capture.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
        ret, frame = capture.read()
        if not ret:
            break

        output_path = os.path.join(output_folder, f"frame_{frame_count}.jpg")
        cv2.imwrite(output_path, frame)

        current_frame += frame_interval
        frame_count += 1

    capture.release()

def create_collage(input_folder, output_path):
    images = [cv2.imread(os.path.join(input_folder, f"frame_{i}.jpg")) for i in range(4)]
    collage = cv2.vconcat([cv2.hconcat(images[:2]), cv2.hconcat(images[2:])])
    cv2.imwrite(output_path, collage)
    print(f"Collage created successfully at {output_path}.")


# For Python Notebooks
# from IPython.display import HTML
# def show_vid(uncompressed_mp4_filepath, temp_output_path = "temp/temp_compressed.mp4"):
#   if os.path.exists(temp_output_path):
#     os.remove(temp_output_path)
#   command = f"ffmpeg -i {uncompressed_mp4_filepath} -vcodec libx264 {temp_output_path}"
#   print("Running command : ", command)
#   os.system(command)
#   print("Done")

#   mp4 = open(temp_output_path,'rb').read()
#   data_url = "data:video/mp4;base64," + b64encode(mp4).decode()
#   return HTML("""
#   <video width=400 controls>
#         <source src="%s" type="video/mp4" video.playbackRate=0.25;>
#   </video>
#   """ % data_url)

# Example usage
# show_vid("sample/test_vid.mp4")

