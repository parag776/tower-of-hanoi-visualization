# Tower of Hanoi Visualization

## Overview
This project visualizes the Tower of Hanoi puzzle. You can customize the number of pegs (towers) and disks, control the animation speed, pause the visualization, and step through the animation one disk at a time.

## Features
- **Customizable Pegs and Disks**: Choose the number of pegs and disks for visualization.
- **Control Speed**: Adjust the animation speed as per your preference.
- **Pause and Resume**: Pause and resume the visualization anytime.
- **Step-by-Step Mode**: Step through the animation one disk at a time for detailed observation.
- **Abort Animation**: Stop the animation at any point.

## Usage
### Initialization
To initialize the Tower of Hanoi visualization, create an instance of the `towerOfHanoi` class with a container `div` and optional settings such as tower count, disk count, height, width, colors, etc.

### Public Functions
- **play()**: Start the animation.
- **pause()**: Pause the animation.
- **resume()**: Resume the animation.
- **abort()**: Stop the animation.
- **step()**: Move the next disk in step mode.
- **toggleStepMode()**: Toggle the step-by-step mode on or off.
- **setStepMode()**: Enable step-by-step mode.
- **unsetStepMode()**: Disable step-by-step mode.
- **isStepMode()**: Check if step-by-step mode is enabled.

## Example
An example `app.js` is provided along with `index.html` to demonstrate the usage of this visualization.

## Note
- Ensure there are at least 2 pegs for the animation to run.
- For 2 pegs, only one disk can be visualized.
- The animation will abort if the conditions are not met.