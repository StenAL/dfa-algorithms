// import $ from '../../../node_modules/jquery/dist/jquery.js';
// import $ from "jQuery";
// import noam from 'noam';
// import Viz from "viz.js";
// Viz = new Viz();

function onInputStringChange() {
    var chars = $("#inputString").val().split("");
    var isValidInputString = -1;
    for (var i = 0; i < chars.length; i++) {
        if (!noam.util.contains(automaton.alphabet, chars[i])) {
            isValidInputString = i;
            break;
        }
    }

    if (isValidInputString === -1) {
        $("#startStop").attr("disabled", false);
        $("#inputString").parent().addClass("success");
        $("#inputString").parent().removeClass("error");
        $("#inputError").hide();
    } else {
        $("#startStop").attr("disabled", true);
        $("#inputString").parent().removeClass("success");
        $("#inputString").parent().addClass("error");
        $("#inputError").show();
        $("#inputError").text(
            "Error: input character at position " + i + " is not in FSM alphabet."
        );
    }
}

function colorStates(states, cssClass) {
    states = getElementsOfStates(states);

    for (var i = 0; i < states.length; i++) {
        states[i].children("ellipse").each(function () {
            $(this).attr("class", cssClass);
        });
    }
}

function getElementsOfStates(states) {
    var retVal = [];

    for (var i = 0; i < states.length; i++) {
        $("title:contains('" + states[i].toString() + "')").each(function () {
            if ($(this).text() === states[i].toString()) {
                retVal.push($(this).parent());
            }
        });
    }

    return retVal;
}

function reorderCirclesInAcceptingStates(states) {
    var stateElements = getElementsOfStates(states);

    for (var i = 0; i < stateElements.length; i++) {
        var e1 = $(stateElements[i].children("ellipse")[0]);
        var e2 = $(stateElements[i].children("ellipse")[1]);
        e1.insertAfter(e2);
    }
}

async function drawGraph() {
    var dotString = noam.fsm.printDotFormat(automaton);
    const viz = new Viz();
    const html = await viz.renderString(dotString, "svg");
    $("#automatonGraph").html([html]);
    reorderCirclesInAcceptingStates(automaton.acceptingStates);
}

var automaton = null;

$("#generateDFA").click(function () {
    automaton = noam.fsm.createRandomFsm(noam.fsm.dfaType, 4, 3, 3);
    $("#fsm").val(noam.fsm.serializeFsmToString(automaton));
    $("#fsm").scrollTop(0);
    $("#fsm").focus();
    onRegexOrAutomatonChange();
});

$("#createAutomaton").click(async function () {
    automaton = noam.fsm.parseFsmFromString($("#fsm").val());
    await drawGraph();
    colorStates([automaton.initialState], "currentState");
});

$("#fsm").change(onRegexOrAutomatonChange);
$("#fsm").keyup(onRegexOrAutomatonChange);

function onRegexOrAutomatonChange() {
    // $("#automatonGraph").html("");
    $("#createAutomaton").attr("disabled", true);
    validateFsm();
}

function validateFsm() {
    var fsm = $("#fsm").val();

    try {
        noam.fsm.parseFsmFromString(fsm);
        $("#fsm").parent().addClass("success");
        $("#createAutomaton").attr("disabled", false);
    } catch (e) {
        console.log("broken input");
    }
}
