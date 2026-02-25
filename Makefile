.PHONY: setup dev run

NOTION_PAGE_ID= :=
setup:
	docker build . -t ntpshin-blog ; \
	docker run -it --rm -v $(PWD):/app ntpshin-blog /bin/bash -c "yarn install" ; \
	echo NOTION_PAGE_ID=$(NOTION_PAGE_ID) > .env.local

dev:
	docker run -it --rm -v $(PWD):/app -p 3000:3000 ntpshin-blog /bin/bash -c "yarn run dev"

run:
	docker run -it --rm -v $(PWD):/app ntpshin-blog /bin/bash