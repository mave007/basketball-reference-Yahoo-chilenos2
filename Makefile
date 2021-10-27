# gem install crxmake
#

basketball-reference-Yahoo-chilenos2.crx: baller.js
	crxmake  --pack-extension-key=../basketball-reference-Yahoo-chilenos2.pem --mode crx --pack-extension=.

all: basketball-reference-Yahoo-chilenos2.crx

clean:
	rm -f *~ basketball-reference-Yahoo-chilenos2.crx
