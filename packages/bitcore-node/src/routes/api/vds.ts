import { Request, Response } from 'express';
import { ChainStateProvider } from '../../providers/chain-state';
import { addMinutes,format } from 'date-fns';

const router = require('express').Router({ mergeParams: true });

router.get('/getSeason', async function(req: Request, res: Response) {
  let { chain, network } = req.params;
  try {
    let tip = await ChainStateProvider.getLocalTip({ chain, network });
    if(tip){
      var curHeight=tip.height;
      var curSeason=1;
      var firstSeasonBlockNumber=30240;
      if(curHeight>=firstSeasonBlockNumber){
        curSeason=Math.floor(((curHeight-firstSeasonBlockNumber)/10080)+2);
      }
      var nextSeasonEndBlockHeight=curHeight;
      if(curSeason<2){
        nextSeasonEndBlockHeight=30239;
      }else{
        var startBlock=30240+(curSeason-2)*10080;
        nextSeasonEndBlockHeight=startBlock+10079;
      }
      var curHeightTime=tip.timeNormalized;
      var interval=nextSeasonEndBlockHeight-curHeight;
      var endTime=format( addMinutes(curHeightTime, interval), 'yyyy-MM-dd HH:mm:ss');
      return res.json({curSeason:curSeason,nexEndBlock:nextSeasonEndBlockHeight,endTime:endTime});
    }else{
      return res.json(tip);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = {
  router,
  path: '/vds'
};
