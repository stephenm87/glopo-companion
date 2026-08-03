# Deployment Guide

## Platform
The application is deployed on Netlify. Production URL: `https://glopocompanion.netlify.app`.

## Build Settings
- **Base directory:** Not set (Root)
- **Build command:** `npm run build`
- **Publish directory:** `build/`
- **Node version:** 22.x

## Functions
Netlify edge and serverless functions are located in the `netlify/functions` directory.

## Environment Variables
Ensure all variables detailed in `docs/ENVIRONMENT.md` are set correctly in the Netlify UI before triggering a build.
