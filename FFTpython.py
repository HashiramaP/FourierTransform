import numpy as np
import matplotlib.pyplot as plt

# Define parameters for the circles
frequencies = np.array([1, 2, 3, 4, 5])  # Frequencies for the DFT
amplitudes = np.array([10, 8, 6, 4, 2])    # Amplitudes for each frequency
phases = np.array([0, np.pi/4, np.pi/2, 3*np.pi/4, np.pi])  # Phases for each frequency

# Create a figure and axis
fig, ax = plt.subplots(figsize=(8, 8))
ax.set_xlim(-20, 20)
ax.set_ylim(-20, 20)
ax.set_aspect('equal')
ax.axhline(0, color='grey', lw=0.5, ls='--')
ax.axvline(0, color='grey', lw=0.5, ls='--')

# Starting point for the first circle
current_x, current_y = 0, 0

# Loop through each frequency and draw the circles
for f, a, p in zip(frequencies, amplitudes, phases):
    # Calculate the endpoint of the current circle
    endpoint_x = current_x + a * np.cos(p)
    endpoint_y = current_y + a * np.sin(p)

    # Draw the circle
    circle = plt.Circle((current_x, current_y), a, color='blue', fill=False, linestyle='--', lw=1.5)
    ax.add_artist(circle)

    # Draw the line (vector) to the endpoint
    ax.plot([current_x, endpoint_x], [current_y, endpoint_y], color='red', lw=2)

    # Mark the endpoint with a dot
    ax.plot(endpoint_x, endpoint_y, 'ro')  # Endpoint dot

    # Update the current position for the next circle
    current_x, current_y = endpoint_x, endpoint_y

# Add labels and title
ax.set_title('Frequency Circles as Vectors')
ax.set_xlabel('Real Part')
ax.set_ylabel('Imaginary Part')

# Show the plot
plt.grid()
plt.show()
