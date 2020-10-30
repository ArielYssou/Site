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
        is after the wall due to the speed beeing too great. In self case we must also
        manually reflect the particle back into the conteiner
        '''
        # Check colision with horizontal walls
        if (self.pos.x + self.radius > right_wall):
            self.speed.x *= -1
            if (self.pos.x > right_wall):
                self.pos.x = right_wall - (right_wall - self.pos.x)
        elif (self.pos.x - self.radius < left_wall)
            self.speed.x *= -1
            if (self.pos.x < left_wall):
                self.pos.x = left_wall + (left_wall - self.pos.x)
        else:
            pass

        # Check colision with vertical walls
        if (self.pos.y + self.radius > top_wall):
            self.speed.y *= -1
            if (self.pos.y > top_wall):
                self.pos.y = top_wall - (top_wall - self.pos.y) 
        elif (self.pos.y - self.radius < bottom_wall):
            self.speed.y *= -1
            if (self.pos.y < bottom_wall):
                self.pos.y = bottom_wall + (bottom_wall - self.pos.y)

        # Update the position
        self.pos = np.add(self.pos, self.speed)

    def colision(self, other):
        '''
        If the distance of the center is less than the sum of the radius then
        they collide.
        OUTPUT:
            True for colision, else False
        '''
        return (np.subtract(self.pos, other.pos) < (self.radius + other.radius))
