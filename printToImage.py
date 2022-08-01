import subprocess
import os
import shutil 

# edit this if your chrome path is different
chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

SpiritDataRoot = os.path.join(os.getcwd(), 'Greg\'s Spirits')
SpiritImageOutput = os.path.join(os.getcwd(), 'Greg\'s Spirit Images')

CardFront = ("card-front.html", "2500,1800")
CardBack = ("card-back.html", "2200,1400")
BoardFront = ("board-front.html", "2200,1400")
BoardLore = ("board-lore.html", "2200,1400")
SourceFiles = [CardFront, CardBack, BoardFront, BoardLore]

assert os.path.exists(SpiritDataRoot)
assert os.path.exists(SpiritImageOutput)

# Remove existing renders
for f in os.listdir(SpiritImageOutput):
  shutil.rmtree(os.path.join(SpiritImageOutput, f))

# Get existing spirit names
spiritNames = os.listdir(SpiritDataRoot)

def screenshot(sourceHtml, output, windowSize):
  screenshotArg = "--screenshot=" + output
  windowSizeArg = "--window-size=" + windowSize
  subprocess.call(["chrome.exe", "--headless", "--disable-gpu", screenshotArg, windowSizeArg, sourceHtml], executable=chromePath)


for spiritName in spiritNames:
  print("Rendering " + spiritName)
  spiritDir = os.path.join(SpiritDataRoot, spiritName)
  destDir = os.path.join(SpiritImageOutput, spiritName)
  if not os.path.exists(destDir):
    os.mkdir(destDir)
  for [sourceType, windowSize] in SourceFiles:
    source = os.path.join(spiritDir, sourceType)
    if not os.path.exists(source):
      continue
    destImage = os.path.join(destDir, sourceType[0:-5] + ".png")
    print(source)
    print(destImage)
    screenshot(source, destImage, windowSize)