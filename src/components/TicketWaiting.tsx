import { random } from "lodash-es";
import { useEffect, useState } from "react";
import { Alert, Box, Button, Progress, Text, Title } from "@mantine/core"


const TicketWaiting = ({
  peopleBeforeYou,
  initialValue,
  className,
  onBuyTicket
}: {
  onBuyTicket: () => void;
  peopleBeforeYou: number;
  initialValue: number;
  className?: string;
}) => {
  return (
    <Box className={`${className} text-white max-w-3xl`}>
      <Title order={1} mb="lg">
        Hey there Swifty!
      </Title>

      <Text size="xl" mb="lg">
        There are a few people waiting in line to buy tickets for the Eras tour.
        Keep this page open so that you don't lose your seat.
      </Text>

      {peopleBeforeYou > 0 ? (
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
      ) : (
        <Alert color="green" title="Congrats!">
          You're next in line! Let's get your ticket!

          <div className="mt-2">
          <Button variant="outline" color="dark" onClick={onBuyTicket}> Get ticket</Button>
          </div>
        </Alert>
      )}
    </Box>
  )
}

function useWaitlistStatus() {
  const [initalValue] = useState(random(1000, 2000));
  const [peopleBeforeYou, setPeopleBeforeYou] = useState(initalValue);

  const stepMargins = [Math.round(initalValue * 0.02), Math.round(initalValue * 0.04)];

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