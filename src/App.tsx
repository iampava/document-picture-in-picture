import { useEffect, useRef, useState } from 'react';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { SuccessConfetti } from './components/SuccessConfetti';
import { Alert, Anchor, Box, Button, Code, Text } from '@mantine/core';
import { TicketWaiting, useWaitlistStatus } from './components/TicketWaiting';

function App() {
  // undefined means we don't know yet
  // true/false means we know if the feature is/is not supported
  const [isFeatureSupported, setIsFeatureSupported] = useState<boolean | undefined>(undefined);

  const finishButtonId = "finish-button";
  const [isPiPEnabled, setIsPiPEnabled] = useState(false);

  // This is the DOM element we'll `.append` into the PiP window
  const contentForPiPRef = useRef<HTMLDivElement>(null);

  // This is the parent/container of the DOM element we'll `.append` into the PiP window
  // We'll append the element back here when PiP is closed
  const contentForPiPParentRef = useRef<HTMLDivElement>(null);

  const [didBuyTicket, setDidBuyTicket] = useState(false);
  const { peopleBeforeYou, initalValue } = useWaitlistStatus()

  // NOTE: using `any` because we don't yet have TS definitions for this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipWindowRef = useRef<any | null>(null);

  const openPiP = async () => {
    const contentForPiP = contentForPiPRef.current;
    if (contentForPiP === null) {
      return;
    }

    // NOTE: Need to use @ts-ignore because the type definition for this
    // method are not yet available.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pipWindowRef.current = await documentPictureInPicture.requestWindow({
      width: 768,
      height: 200
    });

    // >>> START: copy styled
    // Copy style sheets over from the initial document so that the UI looks the same.
    // This part is copy-pasted from
    // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/#copy-style-sheets-to-the-picture-in-picture-window
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
        const style = document.createElement('style');

        style.textContent = cssRules;
        pipWindowRef.current.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        link.media = styleSheet.media.toString();
        if (styleSheet.href !== null) {
          link.href = styleSheet.href;
        }
        pipWindowRef.current.document.head.appendChild(link);
      }
    });
    // <<< END: copy styled

    pipWindowRef.current.document.body.append(contentForPiP);
    setIsPiPEnabled(true);
  }

  const closePiP = () => {
    if (pipWindowRef.current !== null) {
      pipWindowRef.current.close();
    }
  }

  useEffect(() => {
    if ('documentPictureInPicture' in window) {
      setIsFeatureSupported(true);
    } else {
      setIsFeatureSupported(false);
    }
  }, [])

  useEffect(() => {
    if (!isPiPEnabled) {
      return;
    }

    if (
      pipWindowRef.current === null ||
      contentForPiPParentRef.current === null ||
      contentForPiPRef.current === null
    ) {
      return;
    }

    const pipWindow = pipWindowRef.current;
    const progressContainer = contentForPiPParentRef.current;
    const contentForPiP = contentForPiPRef.current;
    const finishButtonFromPiP = pipWindow.document.querySelector(`#${finishButtonId}`);

    pipWindow.addEventListener("pagehide", onPageHide);
    finishButtonFromPiP?.addEventListener("click", onBuyTicketFromPiP);

    return () => {
      pipWindow.removeEventListener("pagehide", onPageHide);
      finishButtonFromPiP?.removeEventListener("click", onBuyTicketFromPiP);
    }

    // NOTE: using `any` because we don't yet have TS definitions for this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onPageHide() {
      progressContainer.append(contentForPiP);
      setIsPiPEnabled(false);
    }

    function onBuyTicketFromPiP() {
      setDidBuyTicket(true);
    }
  }, [isPiPEnabled])

  useEffect(() => {
    if (didBuyTicket === true) {
      closePiP();
    }
  }, [didBuyTicket]);

  return (
    <div className="flex flex-col h-full">
      <Alert title="NOTE">
        <div className="text-base mb-2">
          This is a demo showcasing the
          {' '}
          <Anchor
            target="_blank"
            href="https://developer.chrome.com/docs/web-platform/document-picture-in-picture/"
          >
            Document Picture-in-Picture feature
          </Anchor>. Check out the
          {" "}
          <Anchor target="_blank" href="https://github.com/iampava/document-picture-in-picture">
            GitHub repo
          </Anchor>
          {" "}
          for the full source-code.
        </div>
        <div className="text-base">
          This API is not standard and is only available in Chrome 116+.
          Thus, this demo might fail to work in the future, if the API changes significantly.
        </div>
      </Alert>
      {isFeatureSupported ? (
        <Box id="parent" bg="dark" className="flex-1" p="md">
          {!didBuyTicket ? (
            <div>
              <div ref={contentForPiPParentRef}>
                <Box bg="dark" className="h-full" p="md" ref={contentForPiPRef}>
                  <TicketWaiting
                    className="mb-16"
                    finishButtonId={finishButtonId}
                    initialValue={initalValue}
                    peopleBeforeYou={peopleBeforeYou}
                    onBuyTicket={() => {
                      setDidBuyTicket(true);
                    }}
                  />
                </Box>
              </div>
              {!isPiPEnabled ? (
                <Box p="md">
                  <Button onClick={openPiP} variant="filled" color="pink" leftIcon={(
                    <IconExternalLink size="0.8rem" />
                  )}>
                    Use Picture-in-Picture
                  </Button>
                </Box>
              ) : (
                <Box className="text-white">
                  <Text mb="md">
                    Progress bar is open in Picture-in-Picture mode
                  </Text>

                  <Button onClick={closePiP} variant="filled" color="pink" leftIcon={(
                    <IconX size="0.8rem" />
                  )}>
                    Close Picture-in-Picture
                  </Button>
                </Box>
              )}
            </div>
          ) : (
            <SuccessConfetti />
          )}

        </Box>
      ) : (
        <Alert mt="lg" color="red" title="Feature not supported">
          <div>
            This feature is not supported in your browser.
          </div>
          <div>
            I tested it in Chrome 116. If you're using Chrome 116+ and still see this message
            make sure to enable this flag: <Code>chrome://flags/#document-picture-in-picture-api</Code>
          </div>
        </Alert>
      )}

    </div>
  )
}

export default App
