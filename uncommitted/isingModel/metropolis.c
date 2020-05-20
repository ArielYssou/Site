/*
 * metropolis.c
 *
 * Author: ariel <arielyssou@gmail.com>, 2018
 *
 */

/***** Headers *****/
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#include <math.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

#define LEN 20
#define SIZE (LEN * LEN)

#define MAX_STEPS 1e4
#define CORR_TIME 100

//	Random Number Generator
static inline uint64_t rotl(const uint64_t x, int k) {
	return (x << k) | (x >> (64 - k));
}


static uint64_t s[2];

uint64_t next(void) {
	const uint64_t s0 = s[0];
	uint64_t s1 = s[1];
	const uint64_t result = s0 + s1;

	s1 ^= s0;
	s[0] = rotl(s0, 24) ^ s1 ^ (s1 << 16); // a, b
	s[1] = rotl(s1, 37); // c

	return result;
}


/* This is the jump function for the generator. It is equivaLENt
   to 2^64 calls to next(); it can be used to generate 2^64
   non-overlapping subsequences for parallel computations. */

void jump(void) {
	static const uint64_t JUMP[] = { 0xdf900294d8f554a5, 0x170865df4b3201fc };

	uint64_t s0 = 0;
	uint64_t s1 = 0;
	for(int i = 0; i < sizeof JUMP / sizeof *JUMP; i++)
		for(int b = 0; b < 64; b++) {
			if (JUMP[i] & UINT64_C(1) << b) {
				s0 ^= s[0];
				s1 ^= s[1];
			}
			next();
		}

	s[0] = s0;
	s[1] = s1;
}


/* This is the long-jump function for the generator. It is equivaLENt to
   2^96 calls to next(); it can be used to generate 2^32 starting points,
   from each of which jump() will generate 2^32 non-overlapping
   subsequences for parallel distributed computations. */

void long_jump(void) {
	static const uint64_t LONG_JUMP[] = { 0xd2a98b26625eee7b, 0xdddf9b1090aa7ac1 };

	uint64_t s0 = 0;
	uint64_t s1 = 0;
	for(int i = 0; i < sizeof LONG_JUMP / sizeof *LONG_JUMP; i++)
		for(int b = 0; b < 64; b++) {
			if (LONG_JUMP[i] & UINT64_C(1) << b) {
				s0 ^= s[0];
				s1 ^= s[1];
			}
			next();
		}
	s[0] = s0;
	s[1] = s1;
}

/*seed generator */
uint64_t xs; /* The state can be seeded with any value. */

uint64_t nexts() {
	uint64_t zs = (xs += UINT64_C(0x9E3779B97F4A7C15));
	zs = (zs ^ (zs >> 30)) * UINT64_C(0xBF58476D1CE4E5B9);
	zs = (zs ^ (zs >> 27)) * UINT64_C(0x94D049BB133111EB);
	return zs ^ (zs >> 31);
}

//Essa funcao leva de uint64_t para um double em [0,1]
static inline double to_double(uint64_t xd) {
       const union { uint64_t i; double d; } u = { .i = UINT64_C(0x3FF) << 52 | xd >> 12 };
       return u.d - 1.0;
    }

int Lattice[SIZE], Up[SIZE], Down[SIZE], Left[SIZE], Right[SIZE];

void initial_conditions() {
	// Create initial conditions random spins i.e. T=0
	// Also initializes the boundry conditions
	int i;

	for(i = 0; i < SIZE; i++) {
		Lattice[i] = (rand() % 2) ? -1 : 1;
		Up[i] = i - LEN;
		Down[i] = i + LEN;
		Left[i] = i - 1;
		Right[i] = i + 1;
	}
	
	for(i = 0; i < LEN; i++)
		Up[i] = SIZE - ( LEN - i );

	for(i = SIZE - LEN; i < SIZE; i++)
		Down[i] = i - (SIZE - LEN);

	for(i = 0; i < SIZE; i += LEN) 
		Left[i] = i + (LEN - 1);

	for(i = LEN - 1; i < SIZE; i += LEN) 
		Right[i] = i - (LEN - 1);
}

void show_lattice() {
	int i, j, pos;

	for(i = 0; i < LEN; i ++) {
		for(j = 0; j < LEN; j ++) {
			pos = i + LEN * j;
			if(Lattice[pos] == 1)
				printf("\e[48;5;3m  \e[0m");
			else
				printf("\e[48;5;4m  \e[0m");
		}
		printf("\n");
	}
}


double Magnetization() {
	int i;
	double mag;
	for(i = 0; i < SIZE; i++)
			mag += Lattice[i];
	return fabs( mag / (double) SIZE);
}

double Energy() {
	int i;
	double ener;
	
	for(i = 0; i < SIZE; i++) {
		ener += Lattice[i] * (Lattice[Up[i]] + Lattice[Down[i]] +
				Lattice[Left[i]] + Lattice[Right[i]]);
	}
	return ener;
}

int main(int argc, char **argv) {
	int i, step, dE;//, points = MAX_STEPS / CORR_TIME;
	double r, T, transition_probs[4];
	double m, mag, mag2, nrg, mag4, ener, ener2;
	mag = mag2 = mag4 = ener = ener2 = 0;

	for(T = 0; T < 5.0; T += 0.05) {
		transition_probs[0] = 1;
		transition_probs[1] = exp(-2.0 / T);
		transition_probs[1] = exp(-4.0 / T);
		transition_probs[1] = exp(-6.0 / T);
		transition_probs[1] = exp(-8.0 / T);

		srand((unsigned)time(NULL));
		xs=rand();		//	PRNG seed
		s[1]=nexts();	//	PRNG seed
		s[2]=nexts();	//	PRNG seed

		initial_conditions();
		for(step = 0; step < MAX_STEPS; step ++) {
			//system("clear");
			i = (next() % SIZE);

			dE = 0;
			dE += Lattice[Up[i]];
			dE += Lattice[Down[i]];
			dE += Lattice[Left[i]];
			dE += Lattice[Right[i]];
			dE *= Lattice[i];

			if( dE <= 0 ) {
				Lattice[i] *= -1; //change to static inline;
			} else {
				r = to_double(next());
				if( r < transition_probs[dE] ){
					Lattice[i] *= -1;
				}
			}
		}

		show_lattice();
		m = Magnetization();
		nrg = Energy();
		mag += m;
		mag2 += m * m;
		mag4 += m * m * m * m;
		ener += nrg;
		ener2 += nrg * nrg;

		printf("%f\n", mag4);
	}

	return 0;
}
