class Particle(object):
    '''
    Particle object with simple physics

    Properties:
        pos: Position (vector)
        speed: Speed (vector)
        radius: radius (scalar)
        mass: mass (scalar)

    Methods:
        update: Check boundry condition and update the position based on speed
        collision: Check for a colision with other particle
            INPUT:
                other: Another Particle object.
    '''

    def __init__(self, pos, speed, radius, mass):
        self.pos = pos
        self.speed = speed
        self.radius = radius
        self.mass = mass

    def update(self):
        '''
        Checks boundry conditions and updates the position based on the current speed.
        Another check that must be made is if the center of the particle acctually
        is after the wall due to the speed beeing too great. In this case we must also
        manually reflect the particle back into the conteiner
        '''
        # Check colision with horizontal walls
        if (this.pos.x + this.radius > right_wall):
            this.speed.x *= -1
            if (this.pos.x > right_wall):
                this.pos.x = right_wall - (right_wall - this.pos.x)
        elif (this.pos.x - this.radius < left_wall)
            this.speed.x *= -1
            if (this.pos.x < left_wall):
                this.pos.x = left_wall + (left_wall - this.pos.x)
        else:
            pass

        # Check colision with vertical walls
        if (this.pos.y + this.radius > top_wall):
            this.speed.y *= -1
            if (this.pos.y > top_wall):
                this.pos.y = top_wall - (top_wall - this.pos.y) 
        elif (this.pos.y - this.radius < bottom_wall):
            this.speed.y *= -1
            if (this.pos.y < bottom_wall):
                this.pos.y = bottom_wall + (bottom_wall - this.pos.y)

        # Update the position
        this.pos = np.add(this.pos, this.speed)

    def colision(self, other):
        '''
        If the distance of the center is less than the sum of the radius then
        they collide.
        OUTPUT:
            True for colision, else False
        '''
        return (np.subtract(this.pos, other.pos) < (this.radius + other.radius))
