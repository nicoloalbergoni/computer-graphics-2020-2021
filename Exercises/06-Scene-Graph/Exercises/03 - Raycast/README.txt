The drawing.js file contains an example of raycasting from the mouse position when
the left button of the mouse is released.
The main idea behind this is to transform the point in pixel coordinates all the way
back to world coordinates (in this case, but you could do it also in object or camera 
space) and building a ray from it.
This is done by inverting all the transformations that go from world space to 
pixel coordinates.
When we have the direction in world space, we need to check the collisions of the 
ray with the objects in the scene.
In this case, we only have 3 spheres for which we know centre and radius.
I implemented a simple geometric algorithm to check for collisions between rays
and spheres.
However, if you were to move your spheres, you would have to update their positions.
Furthermore, I leave to you the implementation of a collision check between a ray and
a box (if you need it for the project). You can find a lot of algorithms for this 
online. The one I used was taken from the book Real Time Rendering (4th edition).
If you have complex shapes, approximate them with bounding boxes or spheres.
Implementing precise collisions is way beyond the scope of this course.
Finally, I didn't check to see if there was more than one collision.
That would happen if you had one object behind the other. In that case you should
check the distance at which the collisions happen.
If you have any questions, please do not hesitate to contact me :)