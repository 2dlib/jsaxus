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
function Vector(newX, newY, newZ)
{
	// Member Variables
	var x = isNaN(newX) ? 0.0 : newX;
	var y = isNaN(newY) ? 0.0 : newY;
	var z = isNaN(newZ) ? 0.0 : newZ;

	// ----------------------------------------------------------------

	// Getters
	this.getX = function() { return x; }
	this.getY = function() { return y; }
	this.getZ = function() { return z; }
	
	// Setters
	
	// Setter for X
	this.setX = function(newX) 
	{ 
		x = isNaN(parseFloat(newX)) ? 0.0 : parseFloat(newX); 
	}
	
	// Setter for Y
	this.setY = function(newY) 
	{ 
		y = isNaN(parseFloat(newY)) ? 0.0 : parseFloat(newY); 
	}
	
	// Setter for Z
	this.setZ = function(newZ) 
	{ 
		z = isNaN(parseFloat(newZ)) ? 0.0 : parseFloat(newZ); 
	}

	// Sets a new value for the vector
	this.set = function(newX, newY, newZ)
	{
		var numX = parseFloat(newX);
		var numY = parseFloat(newY);
		var numZ = parseFloat(newZ);

		// If garbage was given, default the values to zero
		x = isNaN(newX) ? 0.0 : newX;
		y = isNaN(newY) ? 0.0 : newY;
		z = isNaN(newZ) ? 0.0 : newZ;
	}
	
	// Sets a new value by passing in a vector
	this.setFromVector = function(newVec)
	{
		if (newVec instanceof Vector)
		{
			x = newVec.getX();
			y = newVec.getY();
			z = newVec.getZ();
		}
	}

	// ----------------------------------------------------------------

	// Dot Product
	this.dot = function(vec)
	{
		var d = 0.0;
		
		if (vec instanceof Vector)
		{
			// Calculate Dot Product
			d = vec.getX() * x + vec.getY() * y + vec.getZ() * z;
		}
		
		return d;
	}

	// Unit normalization
	this.normalize = function()
	{
		var compr = x * x + y * y + z * z;

		if (!isNaN(compr))
		{
			var ln = Math.sqrt(compr);

			// If the length is greater then zero, return the normalized Vector
			if (!isNaN(ln) && ln != 0.0)
			{
				x = x != 0.0 ? x / ln : 0.0;
				y = y != 0.0 ? y / ln : 0.0;
				z = z != 0.0 ? z / ln : 0.0;
			}       
		}
	}

	// Cross product
	this.cross = function(vec)
	{
		var newVec = new Vector();

		// Check to see if a Vector was passed in
		if (vec instanceof Vector)
		{
			var thisVec = copyObj(this);
			var inVec = copyObj(vec);

			// Normalize the Units first            
			inVec.normalize();
			thisVec.normalize();

			// Perform a Cross Product
			newVec.setX(thisVec.getY() * inVec.getZ() - thisVec.getZ() * inVec.getY());
			newVec.setY(thisVec.getZ() * inVec.getX() - thisVec.getX() * inVec.getZ());
			newVec.setZ(thisVec.getX() * inVec.getY() - thisVec.getY() * inVec.getX());
		}

		return newVec;
	}
	
	// Length of the vector
	this.length = function()
	{
		// Return the square root of a dot product
		return Math.sqrt(this.dot(this));
	}
	
	// The Square of the length
	this.lengthSq = function()
	{
		// Return a straight up dot product
		return this.dot(this);
	}
	
	// Add another vector to this vector
	this.add = function(vec)
	{
		var v = new Vector();
		
		if (vec instanceof Vector)
		{
			v.setX(x + vec.getX());
			v.setY(y + vec.getY());
			v.setZ(z + vec.getZ());
		}
		
		return v;
	}
	
	// Subtract a vector form this vector
	this.subtract = function(vec)
	{
		var v = new Vector();
		
		if (vec instanceof Vector)
		{
			v.setX(x - vec.getX());
			v.setY(y - vec.getY());
			v.setZ(z - vec.getZ());
		}
		
		return v;
	}
	
	// Multiply a vector by a scalar
	this.multiply = function(scalar)
	{
		var v = new Vector();
		
		if (!isNaN(scalar))
		{
			v.setX(x * scalar);
			v.setY(y * scalar);
			v.setZ(z * scalar);
		}
		
		return v;
	}
	
	// Divide this vector by a scalar
	this.divide = function(scalar)
	{
		var v = new Vector();
		
		if (!isNaN(scalar))
		{
			v.setX(x / scalar);
			v.setY(y / scalar);
			v.setZ(z / scalar);
		}
		
		return v;
	}
	
	// Check to see if this vector is equal to the passed vector
	this.isEqual = function(vec)
	{
		if (vec instanceof Vector)
		{
			if (x == vec.getX() && y == vec.getY() && z == vec.getZ())
			{
				return true;
			}
		}
		
		return false;
	}
}