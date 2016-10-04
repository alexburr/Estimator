// -------------
// SUPPORT CODE
// -------------
class BarLengths {
    constructor(form, intro, outro) {
        this.form = form;
        this.intro = intro;
        this.outro = outro;
    }
}

class Beats {
    constructor(form, intro, outro) {
        this.inChorus = form * 4;
        this.inIntro = intro * 4;
        this.inOutro = outro * 4;
    }
}

class SongLength {
    constructor(chorusNumber, timeSpan) {
        this.id = "200" + chorusNumber;
        this.chorusNumber = chorusNumber;
        this.timeSpan = timeSpan;
    }
}

class Song {
    constructor (songConfig) {
        this.songLengths = [];
        this.bpm = songConfig.songBpm;
        this.beats = new Beats(songConfig.songForm, songConfig.songIntro, songConfig.songOutro);
        this.maxChorus = songConfig.songMax;
        this.songLengths = this.calculateLengths();
    }
    calculateLengths() {
        var songLengths = [];
        for (var i = 1; i <= this.maxChorus; i++) {
            var secondsForChorus = this.getSecondsForSongByChoruses(i);
            var songLength = new SongLength(i, new TimeSpan(secondsForChorus));
            songLengths.push(songLength);
        }
        return songLengths;
    }
    getSecondsForSongByChoruses(choruses) {
        var minutesPerChorus = this.beats.inChorus / this.bpm;
        var secondsPerChorus = minutesPerChorus * 60;
        var minutesIntroOutro = (this.beats.inIntro + this.beats.inOutro) / this.bpm;
        var secondsIntroOutro = minutesIntroOutro * 60;
        var secondsForSong = (secondsPerChorus * choruses) + secondsIntroOutro;
        return (choruses <= this.maxChorus) ? secondsForSong : null;
    }
}

class TimeSpan {
    constructor(seconds) {
        this.calcValues(seconds);
    }
    calcValues(seconds) {
        // Modified from http://stackoverflow.com/questions/11792726/turn-seconds-into-hms-format-using-jquery
        var minutes = Math.floor(seconds / 60); //Get whole minutes
        seconds -= minutes * 60;
        seconds = Math.floor(seconds);
        this.ideal = ((minutes == 3 && seconds < 50) || (minutes == 2 && seconds > 30));
        this.text = minutes + ":" + (seconds < 10 ? '0' + seconds : seconds); //zero padding on seconds
    }
}

// -------
// REACT!
// -------
var SongRow = React.createClass({
    render: function() {
        var className = this.props.data.timeSpan.ideal ? 'table-success font-weight-bold' : '';
        return (
            <tr><td className={className}>{this.props.data.chorusNumber}</td><td className={className}>{this.props.data.timeSpan.text}</td></tr>
        )
    }
});

var SongRowCollection = React.createClass({
    render: function() {
        var song = new Song(this.props.data);
        var songLengths = song.songLengths.map(function(songLength) {  
            return (
                <SongRow data={songLength} key={songLength.id} />
            );
        });
        return (
            <table className="table table-hover table-sm text-xs-center">
                <thead className="">
                    <tr><th className="text-xs-center">Choruses</th><th className="text-xs-center">Approx. Length</th></tr>
                </thead>
                <tbody>
                    {songLengths}
                </tbody>
            </table>
        )
    }
});

var Form = React.createClass({
    getInitialState: function() {
        return { songBpm: 120, songForm: 32, songIntro: 0, songOutro: 0, songMax: 6 }
    },
    componentDidMount: function() {
        this.displayResults();
    },
    componentDidUpdate: function() {
        this.displayResults();
    },
    handleSongBpmChange: function(e) {
        this.setState({songBpm: e.target.value});
    },
    handleSongFormChange: function(e) {
        this.setState({songForm: e.target.value});
    },
    handleSongIntroChange: function(e) {
        this.setState({songIntro: e.target.value});
    },
    handleSongOutroChange: function(e) {
        this.setState({songOutro: e.target.value});
    },
    handleSongMaxChange: function(e) {
        this.setState({songMax: e.target.value});
    },
    // Use this when including the "Calculate" button
    handleFormSubmit: function(e) {
        e.preventDefault();
        this.displayResults();
    },
    displayResults: function() {
        ReactDOM.render(
            <SongRowCollection data={this.state} />,
            document.getElementById('tableContainer')
        );
    },
    render: function() {
        return (
            <form className="form-horizontal m-b-2" onSubmit={this.handleFormSubmit}>
                <div className="highlight">
                    <div className="form-group row">
                        <label htmlFor="songBpm" className="col-xs-4 control-label text-xs-right">Tempo</label>
                        <div className="col-xs-4">
                            <input type="number" className="form-control" name="songBpm" min="0" max="300" value={this.state.songBpm} pattern="[0-9]*" inputMode="numeric" onChange={this.handleSongBpmChange} />
                        </div>
                        <div className="col-xs-4"><small>BPM</small></div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="songForm" className="col-xs-4 control-label text-xs-right">Chorus Form</label>
                        <div className="col-xs-4">
                            <input type="number" className="form-control" name="songForm" min="0" max="64" value={this.state.songForm} pattern="[0-9]*" inputMode="numeric" onChange={this.handleSongFormChange} />
                        </div>
                        <div className="col-xs-4"><small>bars</small></div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="songIntro" className="col-xs-4 control-label text-xs-right">Intro</label>
                        <div className="col-xs-4">
                            <input type="number" className="form-control" name="songIntro" min="0" max="300" value={this.state.songIntro} pattern="[0-9]*" inputMode="numeric" onChange={this.handleSongIntroChange} />
                        </div>
                        <div className="col-xs-4"><small>bars</small></div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="songOutro" className="col-xs-4 control-label text-xs-right">Outro</label>
                        <div className="col-xs-4">
                            <input type="number" className="form-control" name="songOutro" min="0" max="300" value={this.state.songOutro} pattern="[0-9]*" inputMode="numeric" onChange={this.handleSongOutroChange} />
                        </div>
                        <div className="col-xs-4"><small>bars</small></div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="songMax" className="col-xs-4 control-label text-xs-right">Max</label>
                        <div className="col-xs-4">
                            <input type="number" className="form-control" name="songMax" min="0" max="20" value={this.state.songMax} pattern="[0-9]*" inputMode="numeric" onChange={this.handleSongMaxChange} />
                        </div>
                        <div className="col-xs-4"><small>choruses</small></div>
                    </div>
                    {/*<div className="form-group row">
                        <div className="col-xs-4"></div>
                        <div className="col-xs-4 text-xs-center">
                            <button className="btn btn-primary"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span>Calculate</button>
                        </div>
                        <div className="col-xs-4"></div>
                    </div>*/}
                </div>
            </form>
        );
    }
});

ReactDOM.render(<Form />, document.getElementById('formContainer'));