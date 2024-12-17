import type { Config } from "tailwindcss"

import {nextui} from "@nextui-org/react";

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			'color-1': 'hsl(var(--color-1))',
    			'color-2': 'hsl(var(--color-2))',
    			'color-3': 'hsl(var(--color-3))',
    			'color-4': 'hsl(var(--color-4))',
    			'color-5': 'hsl(var(--color-5))'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-in': {
    				'0%': {
    					opacity: '0'
    				},
    				'10%': {
    					opacity: '1'
    				}
    			},
    			'fade-in-fast': {
    				'0%': {
    					opacity: '0.5'
    				},
    				'50%': {
    					opacity: '1'
    				}
    			},
    			rainbow: {
    				'0%': {
    					'background-position': '0%'
    				},
    				'100%': {
    					'background-position': '200%'
    				}
    			},
    			gradient: {
    				to: {
    					backgroundPosition: 'var(--bg-size) 0'
    				}
    			},
    			'shiny-text': {
    				'0%, 90%, 100%': {
    					'background-position': 'calc(-100% - var(--shiny-width)) 0'
    				},
    				'30%, 60%': {
    					'background-position': 'calc(100% + var(--shiny-width)) 0'
    				}
    			},
    			grid: {
    				'0%': {
    					transform: 'translateY(-50%)'
    				},
    				'100%': {
    					transform: 'translateY(0)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 2s ease-out forwards',
    			'fade-in-fast': 'fade-in-fast 0.5s ease-out forwards',
    			rainbow: 'rainbow var(--speed, 2s) infinite linear',
    			gradient: 'gradient 8s linear infinite',
    			'shiny-text': 'shiny-text 8s infinite',
    			grid: 'grid 15s linear infinite'
    		}
    	},
    	animation: {
    		ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
    		grid: 'grid 15s linear infinite',
    		'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
    		slide: 'slide var(--speed) ease-in-out infinite alternate',
    		spin: 'spin 2s linear infinite'
    	},
    	keyframes: {
    		spin: {
    			'0%': {
    				transform: 'rotate(0deg)'
    			},
    			'100%': {
    				transform: 'rotate(360deg)'
    			}
    		},
    		ripple: {
    			'0%, 100%': {
    				transform: 'translate(-50%, -50%) scale(1)'
    			},
    			'50%': {
    				transform: 'translate(-50%, -50%) scale(0.9)'
    			}
    		},
    		grid: {
    			'0%': {
    				transform: 'translateY(-50%)'
    			},
    			'100%': {
    				transform: 'translateY(0)'
    			}
    		},
    		'spin-around': {
    			'0%': {
    				transform: 'translateZ(0) rotate(0)'
    			},
    			'15%, 35%': {
    				transform: 'translateZ(0) rotate(90deg)'
    			},
    			'65%, 85%': {
    				transform: 'translateZ(0) rotate(270deg)'
    			},
    			'100%': {
    				transform: 'translateZ(0) rotate(360deg)'
    			}
    		},
    		slide: {
    			to: {
    				transform: 'translate(calc(100cqw - 100%), 0)'
    			}
    		}
    	}
    },
	plugins: [
		require("tailwindcss-animate"),
		nextui()
	],
} satisfies Config

export default config