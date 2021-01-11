FROM python:3.7-stretch
RUN curl -fsSL https://get.docker.com | sh
RUN pip3 install molecule[docker,ansible,lint] flake8 pytest-testinfra
WORKDIR mono/deployment-e2e
