import { random } from "lodash-es";
import { useEffect, useState } from "react";
import { Alert, Anchor, Box, Button, Progress, Text, Title } from "@mantine/core"


const TicketWaiting = ({
  peopleBeforeYou,
  initialValue,
  className,
  onBuyTicket,

  // ID of the button that will be clicked when is the user's turn.
  // We need an ID because via normal React events this doesn't work if
  // the button is in a Picture-in-Picture mode. Thus, we attach an ID
  // and use the vanilla approach!
  finishButtonId
}: {
  onBuyTicket: () => void;
  peopleBeforeYou: number;
  initialValue: number;
  finishButtonId: string;
  className?: string;
}) => {
  return (
    <Box className={`${className} text-white max-w-3xl`}>
      <Title order={1} mb="lg">
        Hey there Swifty!
      </Title>

      <Text size="xl" mb="lg">
        There are a few people waiting in line to buy tickets for the
        {" "}
        <Anchor
          target="_blank"
          href="https://www.taylorswift.com/tour-us/">
          Eras tour
        </Anchor>
        .
        Keep this page open so that you don't lose your seat.
      </Text>

      {/*
        You might wonder why we hide the elements using CSS,
        instead of using conditional rendering. Well, initially
        I was conditionally rendering but because Mantine.dev is
        using Styled Components that are added in the page only when
        a certain component is used, the success Alert at the bottom
        was not correctly styled. So, just for demo purposes I decided
        to use CSS to hide the elements.
      */}
      <div className={peopleBeforeYou > 0 ? "block" : "hidden"}>
        <Progress
          size="lg"
          color="pink"
          p="lg"
          classNames={{
            label: "text-xs"
          }}
          label={peopleBeforeYou.toString()}
          value={100 - (peopleBeforeYou / initialValue) * 100}
        />
      </div>
      <div className={peopleBeforeYou > 0 ? "hidden" : "block"}>
        <Alert color="green" title="Congrats!">
          You're next in line! Let's get your ticket!

          <div className="mt-2">
            <Button id={finishButtonId} variant="outline" color="dark" onClick={onBuyTicket}> Get ticket</Button>
          </div>
        </Alert>
      </div>
    </Box>
  )
}

function useWaitlistStatus() {
  const [initalValue] = useState(random(1000, 2000));
  const [peopleBeforeYou, setPeopleBeforeYou] = useState(initalValue);

  const stepMargins = [Math.round(initalValue * 0.05), Math.round(initalValue * 0.09)];

  useEffect(() => {
    if (peopleBeforeYou === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setPeopleBeforeYou(
        (value) => Math.max(0, value - random(stepMargins[0], stepMargins[1]))
      );
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [peopleBeforeYou]);

  return { peopleBeforeYou, initalValue };
}

export { TicketWaiting, useWaitlistStatus }