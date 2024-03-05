#!/bin/bash

npx webpack --mode development && 
cp dist/* electron/assets/
