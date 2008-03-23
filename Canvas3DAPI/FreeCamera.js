/*Copyright (c) 2008 Catherine Leung, Mark Paruzel, Andrew Smith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
function FreeCamera()
{
	// Raw Position Values
	var left	= new Vector(1.0, 0.0, 0.0); // Camera Left vector
	var up		= new Vector(0.0, 1.0, 0.0); // Camera Up vector
	var dir		= new Vector(0.0, 0.0, 1.0); // The direction its looking at
	var pos		= new Vector(0.0, 0.0, 0.0); // Camera eye position
	
	// Delta Values for Animations
	var linVel	= new Vector(0.0, 0.0, 0.0); // Animation of positions
	var angVel	= new Vector(0.0, 0.0, 0.0); // Animations of rotation around (side Vector, up Vector, dir Vector)
	
	// -------------------------------------------------------

	// Getters
	this.getPosition	= function() { return new Vector(pos.getX(), pos.getY(), pos.getZ()); }
	this.getUp			= function() { return new Vector(up.getX(), up.getY(), up.getZ()); }
	this.getDir			= function() { return new Vector(dir.getX(), dir.getY(), dir.getZ()); }
	this.getLeft		= function() { return new Vector(left.getX(), left.getY(), left.getZ()); }
	this.getLinearVel	= function() { return new Vector(linVel.getX(), linVel.getY(), linVel.getZ()); }
	this.getAngularVel	= function() { return new Vector(angVel.getX(), angVel.getY(), angVel.getZ()); }
	
	// Setters	
	// Set the new location of the camera
	this.setPosition = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			// Set the new Position of the eye
			pos.setFromVector(newVec);
		}
	}
	
	// Set the point in space where the camera will look at (No Animation)
	this.setLookAtPoint = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			// Figure out the direction of the point we are looking at
			dir.setFromVector(newVec);
			dir.normalize();
			
			// Adjust the Up and Left vectors accordingly
			left = dir.cross(new Vector(0.0, 1.0, 0.0));
			left.normalize();
			up = dir.cross(left.multiply(-1.0));
			up.normalize();
		}
	}
	
	// Set the orientation of Up (No Animation)
	this.setUpVector = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			up.setFromVector(newVec);
		}
	}
	
	// Set a new Linear Velocity that will be added to the Position on every update
	this.setLinearVel = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			linVel.setFromVector(newVec);
		}
	}
	
	// Set a new Angular Veclocity that will be added to the rotation on every update
	this.setAngularVel = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			angVel.setFromVector(newVec);
		}
	}
	
	// -------------------------------------------------------
	
	// Rotate camera on an Axis which is centered on the position of the camera
	this.rotateOnAxis = function(axisVec, angle)
	{
		var mat = new Matrix();
		var quat = new Quaternion();
		
		if (axisVec instanceof Vector && !isNaN(angle))
		{
			// Clean the Matrix
			mat.identity();
			
			// Create a proper Quaternion based on location and angle
			quat.setFromAxisAngle(axisVec, angle);
			
			// Create a rotation Matrix out of this quaternion
			mat = quat.getMatrix();
			
			// Apply changes to the remaining vectors
			dir = mat.multiplyByVector(dir);
			dir.normalize();
			left = mat.multiplyByVector(left);
			left.normalize();
			up = mat.multiplyByVector(up);
			up.normalize();
		}	
	}
	
	// Rotate around the Up Vector by a hard amount (No Animation)
	this.yaw = function(angle)
	{
		this.rotateOnAxis(up, angle);
	}
	
	// Rotate around the Dir Vector by a hard amount (No Animation)
	this.roll = function(angle)
	{
		this.rotateOnAxis(dir, angle);
	}
	
	// Rotate around the Side Vector by a hard amount (No Animation)
	this.pitch = function(angle)
	{
		this.rotateOnAxis(left, angle);	
	}
	
	// Update Animation of the camera
	this.update = function(timeStep)
	{
		if (linVel.lengthSq() > 0.0001)
		{
			// Add a velocity to the position
			var velVec = new Vector(linVel);
			
			velVec.multiply(timeStep);
			pos.add(velVec);
		}
		
		if (angVel.lengthSq() > 0.0001)
		{
			// Apply some rotations to the orientation from the angular velocity
			this.pitch(angVel.getX() * timeStep);
			this.yaw(angVel.getY() * timeStep);
			this.roll(angVel.getZ() * timeStep);
		}
	}
	
	// Calls the OpenGL calls to stick the camera in the right place
	this.applyToWorld = function(glCanvas3D)
	{
		// Set the camera in OpenGL Space
		glCanvas3D.loadIdentity();
		glCanvas3D.gluLookAt(pos.getX(), pos.getY(), pos.getZ(), dir.getX(), dir.getY(), dir.getZ(), up.getX(), up.getY(), up.getZ());
	}	
}