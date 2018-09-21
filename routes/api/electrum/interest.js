const KOMODO_ENDOFERA = 7777777;
const LOCKTIME_THRESHOLD = 500000000;

// TODO: tiptime != 0 && nLockTime < tiptime

module.exports = (api) => {
  api.kmdCalcInterest = (locktime, value, height) => { // value in sats
    const timestampDiff = Math.floor(Date.now() / 1000) - locktime - 777;
    const hoursPassed = Math.floor(timestampDiff / 3600);
    const minutesPassed = Math.floor((timestampDiff - (hoursPassed * 3600)) / 60);
    const secondsPassed = timestampDiff - (hoursPassed * 3600) - (minutesPassed * 60);
    let timestampDiffMinutes = timestampDiff / 60;
    let interest = 0;

    api.log(`${height} vs ${KOMODO_ENDOFERA}`, 'spv.interest');
    api.log(`${locktime} vs ${LOCKTIME_THRESHOLD}`, 'spv.interest');

    if (height < KOMODO_ENDOFERA &&
        locktime >= LOCKTIME_THRESHOLD) {
      api.log('kmdCalcInterest =>', 'spv.interest');
      api.log(`locktime ${locktime}`, 'spv.interest');
      api.log(`minutes converted ${timestampDiffMinutes}`, 'spv.interest');
      api.log(`passed ${hoursPassed}h ${minutesPassed}m ${secondsPassed}s`, 'spv.interest');

      // calc interest
      if (timestampDiffMinutes >= 60) {
        if (height >= 1000000 &&
            timestampDiffMinutes > 31 * 24 * 60) {
          api.log('kmd new interest conditions', 'spv.interest');
          timestampDiffMinutes = 31 * 24 * 60;
        } else {
          if (timestampDiffMinutes > 365 * 24 * 60) {
            timestampDiffMinutes = 365 * 24 * 60;
          }
          timestampDiffMinutes -= 59;

          // TODO: check if interest is > 5% yr
          // calc ytd and 5% for 1 yr
          // const hoursInOneYear = 365 * 24;
          // const hoursDiff = hoursInOneYear - hoursPassed;
        }

        interest = ((Number(value) * 0.00000001) / 10512000) * timestampDiffMinutes;
        api.log(`interest ${interest}`, 'spv.interest');
      }
    }

    return interest;
  }

  return api;
};