FROM nginx:alpine

# Remove the default nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy the dashboard and nginx config
COPY index.html /usr/share/nginx/html/index.html
COPY style.css  /usr/share/nginx/html/style.css
COPY control_panel.js  /usr/share/nginx/html/control_panel.js
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80