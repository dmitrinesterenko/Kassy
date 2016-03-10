FROM node:5.8.0

VOLUME /webapp/current
WORKDIR /webapp/current
CMD ["npm install"]
CMD ["/bin/bash", "scripts/entrypoint.sh"]

