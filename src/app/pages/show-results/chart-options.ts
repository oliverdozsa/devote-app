import {Poll, PollOption} from "../../services/voting";
import {PollOptionCode} from "./show-results-operations";
import {EChartsOption} from "echarts";
import {NbJSThemeOptions} from "@nebular/theme";

export function createBarChartConfig(poll: Poll, pollResults: Map<PollOptionCode, Number>, theme: NbJSThemeOptions): EChartsOption {
  const categories = poll.pollOptions.map(o => o.name);
  const chartResults = poll.pollOptions.map(o => getResultForOptionOrZero(o, pollResults));
  const colors: any = theme.variables;

  /*
  * echarts: {
      bg: baseThemeVariables.bg,
      textColor: baseThemeVariables.fgText,
      axisLineColor: baseThemeVariables.fgText,
      splitLineColor: baseThemeVariables.separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: baseThemeVariables.primary,
      areaOpacity: '0.7',
    },*/

  return {
    color: [colors.primaryLight],
    backgroundColor: colors.bg,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: "category",
      data: categories,
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: colors.fgText,
        },
      },
      axisLabel: {
        color: colors.fgText
      },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLine: {
        lineStyle: {
          color: colors.fgText,
        },
      },
      splitLine: {
        lineStyle: {
          color: colors.separator,
        },
      },
      axisLabel: {
        color: colors.fgText
      },
    },
    series: [
      {
        data: chartResults,
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(220, 220, 220, 0.8)"
        },
        animationDelay: idx => idx * 10
      }
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: idx => idx * 5
  }
}

function getResultForOptionOrZero(option: PollOption, pollResults: Map<PollOptionCode, Number>) {
  if (pollResults.has(option.code)) {
    return pollResults.get(option.code)!.valueOf();
  } else {
    return 0;
  }
}
