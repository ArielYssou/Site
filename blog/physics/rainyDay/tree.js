function pineLeaf(p, clr) {
  var leaf = {};
  leaf.clr = clr

  leaf.draw = function(x, y, wdth, len) {
    p.push()
    p.fill(leaf.clr)
    p.triangle(
      x + wdth/2, y,
      x, y + len,
      x - wdth/2, y
    );
    p.pop()
  }
  return leaf
}

function Leaf(p, x, y, velx, vely, accx, accy, clr, m = 25) {
  var leaf = {};

  leaf.pos = p.createVector(x, y, 0);
  leaf.vel = p.createVector(velx, vely, 0);
  leaf.acc = p.createVector(accx, accy, 0);
  leaf.acc.mult(1 / m)

  leaf.m = m
  leaf.clr = clr
  leaf.display_clr = clr
  leaf.len = 8;
  leaf.hei = 12;

  leaf.frames = 0
  leaf.max_frames = p.randomGaussian(130, 30)

  leaf.update = function(wind, grav) {
    leaf.acc.x = 5 * wind;

    leaf.vel.add(leaf.acc);
    leaf.pos.add(leaf.vel);
    leaf.frames += 1;
    leaf.display_clr = p.lerpColor(
      leaf.clr,
      p.color(55,55,55), //Background color
      leaf.frames/leaf.max_frames);
  };

  leaf.show = function() {
    p.push()
    p.strokeWeight(0)
    p.fill(leaf.display_clr)
    p.triangle(
      leaf.pos.x + leaf.len, leaf.pos.y,
      leaf.pos.x, leaf.pos.y + leaf.hei,
      leaf.pos.x - leaf.len, leaf.pos.y
    );
    p.pop()
  }
  return leaf;
}

function Branch(p, mass, k, len, clr, theta = 0, omega = 0, alpha = 0) {
  var branch = {}
  branch.mass = mass
  branch.k = k
  branch.len = len
  branch.clr = clr
  branch.wdth = branch.len / 3

  branch.theta = theta
  branch.omega = omega
  branch.alpha = alpha

  branch.Fres = 0
  branch.CM = branch.len / 2
  branch.leafs = []

  branch.update = function() {
    branch.omega += branch.alpha 
    branch.theta += branch.omega
  }

  branch.draw = function(x, y) {
    p.push()
    p.fill(branch.clr);
    p.rect(x + branch.wdth/2, y, -branch.wdth, -branch.len)
    p.pop()
  }

  branch.draw_leafs = function(x, y) {
    p.push()
    for(j = 0; j < branch.leafs.length; j += 1) 
      branch.leafs[j].draw(x, y, - 6 * branch.wdth, -2 * branch.len);
    p.pop()
  }
  return branch;
}

function Tree(p, segments, leaf_prob) {
  var tree = {}
  tree.branches = []
  tree.dropped_leafs = []
  tree.leaf_prob = leaf_prob;

  //tree.btn_clr = color(38, 104, 36)
  tree.btn_clr = p.color(79, 91, 25);
  tree.top_clr = p.color(48, 130, 45);
  tree.brk_clr = p.color(170, 126, 76);


  for(i = 0; i < segments; i += 1) {
      tree.branches.push(Branch(p, 3, 0.03, p.height / (2.3*(i+2)), tree.brk_clr));
    if(i > 0)
      tree.branches[i].leafs.push(
        pineLeaf(
          p,
          p.lerpColor(tree.btn_clr, tree.top_clr, i / segments)
        )
      );
    else
      tree.branches[i].len = p.height / 10;
  }

  tree.show = function(show_leafs = true, show_dropped = true) {
    p.push();
    p.translate(p.width / 2, p.height);
    for(i = 0; i < tree.branches.length; i += 1) {
      tree.branches[i].draw(0, 0);
      p.rotate(tree.branches[i].theta);
      p.translate(0, -tree.branches[i].len);

    }
    p.pop();

    if(show_leafs) {
      p.push();
      p.translate(p.width / 2, p.height)
      for(i = 0; i < tree.branches.length; i += 1) {
        tree.branches[i].draw_leafs(0, 0);
        p.rotate(tree.branches[i].theta);
        p.translate(0, -tree.branches[i].len);
      }
      p.pop();
    };

    if(show_dropped) {
      for(var i = 0; i < tree.dropped_leafs.length; i += 1) {
        tree.dropped_leafs[i].show()
      }
    }
  }

  tree.update = function(Fwind = 0, grav = 0.2) {
    displacement = 0;
    var Fel, Fres, Ftot;

    var posx = p.width / 2
    var posy = p.height
    var theta = scene.tree.branches[0].theta
    posx += tree.branches[0].len * p.cos(theta)
    posy -= tree.branches[0].len * p.cos(theta)

    for(i = 0; i < tree.branches.length; i += 1) {
      sine = p.sin(tree.branches[i].theta)
      displacement = tree.branches[i].theta
      Fel = - displacement * tree.branches[i].k 
      Fres =  - tree.branches[i].omega * 0.1

      if( p.abs(tree.branches[i].theta) > p.PI /2) {Fwind = 0};

      Ftot = Fwind * p.cos(tree.branches[i].theta) + Fel + Fres
      tree.branches[i].alpha = Ftot 
      tree.branches[i].update()

      posx += tree.branches[i].len * p.sin(theta)
      posy -= tree.branches[i].len * p.cos(theta)
      theta += tree.branches[i].theta
      if(p.random() < tree.leaf_prob ) {
        tree.dropped_leafs.push(
          Leaf(
            p,
            p.randomGaussian(posx, 0.1),
            p.randomGaussian(posy, 0.07),
            6, 0, 0, grav, tree.top_clr
          )
        );
      }
    }

    // Falling leafs
    for(var j = 0; j < tree.dropped_leafs.length; j += 1) {
      tree.dropped_leafs[j].update(Fwind, grav);
      if(tree.dropped_leafs[j].frames > tree.dropped_leafs[j].max_frames)
        tree.dropped_leafs.splice(j, 1);
    };
  }

  return tree;
}

