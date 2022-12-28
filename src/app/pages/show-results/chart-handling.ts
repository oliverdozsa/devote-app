import {CollectedVoteResults, PollIndex} from "./show-results-operations";
import {EChartsOption} from "echarts";
import {NbJSThemeOptions} from "@nebular/theme";
import {ChartOptionsBuilder} from "./chart-options-builder";
import {Poll} from "../../services/voting";

export enum Chart {
  Bar,
  Pie
}

export class ChartHandling {
  private chosenCharts: Map<PollIndex, Chart> = new Map<PollIndex, Chart>();
  private pollsEchartOptions: Map<PollIndex, EChartsOption> = new Map<PollIndex, EChartsOption>();
  private chartOptionsBuilder: ChartOptionsBuilder = new ChartOptionsBuilder();

  private themeOptions: NbJSThemeOptions | undefined;
  private polls: Poll[] | undefined;
  private voteResults: CollectedVoteResults | undefined;

  constructor() {
  }

  get hasTheme(): boolean {
    return this.themeOptions != undefined;
  }

  toggleChartOf(poll: Poll) {
    const current = this.chosenCharts.get(poll.index);
    if(current == Chart.Bar){
      this.chosenCharts.set(poll.index, Chart.Pie);
    } else {
      this.chosenCharts.set(poll.index, Chart.Bar);
    }

    this.rebuildChartOptionsIfNeededFor(poll);
  }

  getChartOf(poll: Poll) {
    return this.chosenCharts.get(poll.index);
  }

  getEChartOptionsOf(poll: Poll): EChartsOption {
    if(this.pollsEchartOptions.has(poll.index)) {
      return this.pollsEchartOptions.get(poll.index)!;
    }

    if(this.voteResults != undefined && this.voteResults.size == 0) {
      return {
        title: {
          text: "no results yet"
        }
      }
    }

    return {};
  }

  updateThemeOptions(themeOptions: NbJSThemeOptions) {
    this.themeOptions = themeOptions;

    this.rebuildPollsEchartOptionsIfNeeded();
  }

  updateResults(results: CollectedVoteResults, polls: Poll[]) {
    this.voteResults = results;
    this.polls = polls;

    this.initChosenChartsIfNeeded(polls);
    this.rebuildPollsEchartOptionsIfNeeded();
  }

  private rebuildPollsEchartOptionsIfNeeded() {
    this.polls?.forEach(p => this.rebuildChartOptionsIfNeededFor(p));
  }

  private rebuildChartOptionsIfNeededFor(poll: Poll) {
    if (this.themeOptions == undefined || this.voteResults == undefined) {
      return;
    }

    const chartType = this.chosenCharts.get(poll.index);

    this.chartOptionsBuilder
      .setTheme(this.themeOptions!)
      .setPollAndResults(poll, this.voteResults?.get(poll.index)!)

    let chartOptions;
    if (chartType == Chart.Bar) {
      chartOptions = this.chartOptionsBuilder.buildBarChartOptions();
    } else {
      chartOptions = this.chartOptionsBuilder.buildPieChartOptions();
    }

    this.pollsEchartOptions.set(poll.index, chartOptions);
  }

  private initChosenChartsIfNeeded(polls: Poll[]) {
    polls.forEach(p => {
      if (!this.chosenCharts.has(p.index)) {
        this.chosenCharts.set(p.index, Chart.Bar)
      }
    });
  }
}
