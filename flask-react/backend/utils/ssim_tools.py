import os
import cv2
import json
import logging

from base64 import b64encode
from pathlib import Path
from natsort import natsorted
from skimage.metrics import structural_similarity as ssim

from utils.video_tools import sort_image_files_in_dir

logger = logging.getLogger()

# Calculates the ssim scores between 2 frames
def calculate_ssim(frame1, frame2):
    # Convert frames to grayscale if they are in color
    if len(frame1.shape) == 3:
        frame1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    if len(frame2.shape) == 3:
        frame2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)

    # Ensure both frames have the same shape
    if frame1.shape != frame2.shape:
        raise ValueError("Input frames must have the same shape.")

    # Calculate SSIM score
    ssim_score, _ = ssim(frame1, frame2, full=True)
    return ssim_score

# Sequentially processes the images to filter frames that fall above the threshold, 
# that is every sequential frame will have ssim scores of lesser or equal to the threshold
def calculate_frames_ssim(image_file_paths, ssim_threshold = 0.85):
  logger.debug("Processing video with " + str(len(image_file_paths)) + "frames with SSIM Threshold = " + str(ssim_threshold))
  # Get the dimensions of the first image
  first_image = cv2.imread(image_file_paths[0])

  current_frame_index = 1
  previous_frame = first_image
  scores = {
      "img_paths": [ image_file_paths[0], ],
      "ssim_scores": [ 0, ],
      "ssim_threshold": ssim_threshold,
    }
  img_paths = scores["img_paths"]
  ssim_scores = scores["ssim_scores"]
  # Write each image to the video
  for current_frame_index in range(1, len(image_file_paths)):
    if current_frame_index % 100 == 0:
      logger.debug("Processing frame : " + str(current_frame_index))

    img_path = image_file_paths[current_frame_index]
    image = cv2.imread(img_path)

    ssim_score = calculate_ssim(previous_frame, image)
    # only save the frames with low score with the last frame in the sampled video and not the whole video
    if ssim_score < ssim_threshold:
      img_paths.append(img_path)
      ssim_scores.append(ssim_score)
      previous_frame = image

  logger.debug(f"Finished processing all {len(image_file_paths)} frames")
  return scores
  
# Calculates the score for all images in a directory (first natsorts it)
def calculate_video_ssim(video_path, ssim_threshold = 0.85, save_path=None):
  image_file_paths = sort_image_files_in_dir(video_path)
  frame_ssim_scores = calculate_frames_ssim(image_file_paths, ssim_threshold)

  if save_path:
    with open(save_path, "w") as save_file:
      save_file.write(json.dumps(frame_ssim_scores, indent=2))

  return frame_ssim_scores
