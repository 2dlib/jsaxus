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
function Primitive()
{
	// Member Variables
	var visible	    = true;
	
	// Raw Position Values
	var left	    = new Vector(1.0, 0.0, 0.0); // Left vector
	var up		    = new Vector(0.0, 1.0, 0.0); // Up Vector
	var dir		    = new Vector(0.0, 0.0, 1.0); // Forward Vector
	var pos		    = new Vector(0.0, 0.0, 0.0); // Position

	// Delta Values for Animations
	var linVel		= new Vector(0.0, 0.0, 0.0); // Animation of positions
	var angVel		= new Vector(0.0, 0.0, 0.0); // Animations of rotation around (side Vector, up Vector, dir Vector)
	
	// -------------------------------------------------------

	// Getters
	this.getPosition	= function() { return new Vector(pos.getX(), pos.getY(), pos.getZ()); }
	this.getUp			= function() { return new Vector(up.getX(), up.getY(), up.getZ()); }
	this.getDirection	= function() { return new Vector(dir.getX(), dir.getY(), dir.getZ()); }
	this.getLeft		= function() { return new Vector(left.getX(), left.getY(), left.getZ()); }
	this.getLinearVel	= function() { return new Vector(linVel.getX(), linVel.getY(), linVel.getZ()); }
	this.getAngularVel	= function() { return new Vector(angVel.getX(), angVel.getY(), angVel.getZ()); }
	this.isVisible      = function() { return visible; }
	
	// Setters	
	
	// Set the visibility state
	this.setVisible = function(show)
	{
		visible = show;
	}	
	
	// Set the new location of the Primitive
	this.setPosition = function(vecPos)
	{
		if (vecPos instanceof Vector)
		{
			// Set the new Position of the eye
			pos = vecPos;
		}
	}
	
	// Set the point in space where the Primitive will look at (No Animation)
	this.setForward = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			// Figure out the direction of the point we are looking at
			dir.setFromVector(pos);
			dir.subtract(newVec);
			dir.normalize();
			
			// Adjust the Up and Left vectors accordingly
			left = up.cross(dir);
			left.normalize();
			up = dir.cross(up);
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
	
	// Rotate Primitive on an Axis which is centered on the position of the Primitive
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
	
	// Update animations, etc.
	this.update = function(timeStep)
	{
		// Add a velocity to the position
		var velVec = new Vector(linVel);
		velVec.multiply(timeStep);
		pos.add(velVec);
		
		// Apply some rotations to the orientation from the angular velocity
		this.pitch(angVel.getX() * timeStep);
		this.yaw(angVel.getY() * timeStep);
		this.roll(angVel.getZ() * timeStep);
	}
	
	// Render the object
	this.render = function(glCanvas3D)
	{
		if (glCanvas3D != null)
		{
			var buffers = {};
			var vertArray = new Array();
			var normArray = new Array();
			var colorArray = new Array();

			// This would be easier if we had an Index Buffer
			var vecArr = [up,					left,					// 1
						  up.multiply(-1.0),	left,					// 2
						  up.multiply(-1.0),	left.multiply(-1.0),	// 3
						  up,					left.multiply(-1.0),	// 4
						 ];
			
			// Using the vectors above, calculate the verticies
			for (var i = 0; i < (2 * 4); i += 2)
			{
				var v = new Vector();
				v.setFromVector(pos.add(vecArr[i]));
				v.setFromVector(v.add(vecArr[i + 1]));
				
				// Set the individual Vertex Coords
				vertArray.push(v.getX());
				vertArray.push(v.getY());
				vertArray.push(v.getZ());
				
				// Calculate the Normals
				var n = new Vector(0.0, 0.0, 0.0);
				n.setFromVector(v.subtract(pos));
				n.normalize();
				
				normArray.push(n.getX());
				normArray.push(n.getY());
				normArray.push(n.getZ());

				// Set some colors
				colorArray.push(0.6); // R
				colorArray.push(0.8); // G
				colorArray.push(0.3); // B
				colorArray.push(1);	  // A
			}
			
			// Create Buffers				   
			buffers.vertex = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 3, glCanvas3D.FLOAT, vertArray);
			buffers.normal = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 3, glCanvas3D.FLOAT, normArray);
			buffers.color = glCanvas3D.createBuffer(glCanvas3D.STATIC_DRAW, 4, glCanvas3D.FLOAT, colorArray);
	
			// Apply the buffers to OpenGL
			glCanvas3D.enable(glCanvas3D.CULL_FACE);
			glCanvas3D.frontFace(glCanvas3D.CCW);
			glCanvas3D.vertexPointer(buffers.vertex);
			glCanvas3D.normalPointer(buffers.normal);
			glCanvas3D.colorPointer(buffers.color);

			// Flag OpenGL that we will be using buffers
			glCanvas3D.enableClientState(glCanvas3D.VERTEX_ARRAY);
			glCanvas3D.enableClientState(glCanvas3D.NORMAL_ARRAY);
			glCanvas3D.enableClientState(glCanvas3D.COLOR_ARRAY);

			// Draw
			glCanvas3D.drawArrays(glCanvas3D.TRIANGLE_FAN, 0, 4);

			// Turn off Buffers
			glCanvas3D.disableClientState(glCanvas3D.VERTEX_ARRAY);
			glCanvas3D.disableClientState(glCanvas3D.NORMAL_ARRAY);
			glCanvas3D.disableClientState(glCanvas3D.COLOR_ARRAY);
		}
	}
}