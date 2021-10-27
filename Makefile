# gem install crxmake
#

baller.js:
	crxmake  --pack-extension-key=../basketball-reference-Yahoo-chilenos2.pem --mode crx --pack-extension=.

all: baller.js

clean:
	rm -f *~
