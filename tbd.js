randomValue = 20;
randomLength = 5;

function generateProgram(){
    var program_obj = new Object();
    program_obj.type = "program";
    program_obj.variant = getRandomInt(2);
    program_obj.start = [];
    program_obj.variable = []
    for (let i = 0; i <= getRandomInt(2); i++) {
        program_obj.variable.push(String.fromCharCode(97+i));
        program_obj.start.push(getRandomInt(randomValue)-10);
    }
    console.log(program_obj.start);
    program_obj.end = [...program_obj.start];
    program_obj.length = getRandomInt(randomLength)+1;
    program_obj.program = [];
    program_obj.bool = true;

    for (let i = 0; i < program_obj.length; i++) {
        switch (getRandomInt(4)) {
            case 0:
                program_obj.program.push(generateSkip());
                break;
            case 1:
                program_obj.program.push(generateAssign(program_obj));
                break;
            case 2:
                program_obj.program.push(generateIf(program_obj));
                break;
            case 3:
                program_obj.program.push(generateDo(program_obj));
                break;
        
            default:
                break;
        }
        
    }
    console.log(program_obj);
    parseProgram(program_obj);
    return 0;
}

function generateSkip(){
    var skip = new Object();
    skip.type = "skip";
    return skip;
}   

function generateAssign(program_obj, index = getRandomInt(program_obj.variable.length), multiplier = 1, variant = getRandomInt(3), assign = getRandomInt(randomValue)-10){
    var assign_obj = new Object();
    assign_obj.type = "assign";
    assign_obj.variant = variant;
    assign_obj.index = index;
    assign_obj.variable = program_obj.variable;
    assign_obj.before = program_obj.end[assign_obj.index];
    assign_obj.assign = assign;
    if(program_obj.bool){
        switch (assign_obj.variant) {
            case 0:
                program_obj.end[assign_obj.index] = assign_obj.assign;
                break;
            case 1:
                program_obj.end[assign_obj.index] += assign_obj.assign * multiplier;
                break;
            case 2:
                program_obj.end[assign_obj.index] -= assign_obj.assign * multiplier;
                break;
            default:
                break;
        }
    }
    return assign_obj;

}

function generateIf(program_obj){
    var if_obj = new Object();
    if_obj.type = "if";
    if_obj.variant = getRandomInt(7);
    if_obj.index = getRandomInt(program_obj.variable.length);
    if_obj.variable = program_obj.variable;
    if_obj.program = [];
    if_obj.value = getRandomInt(randomValue)-10;
    if_obj.end = program_obj.end;
    switch (if_obj.variant) {
        case 0:
            if_obj.bool = true;
            break;
        case 1:
            if_obj.bool = (if_obj.end[if_obj.variable] == if_obj.value);
            break;
        case 2:
            if_obj.bool = (if_obj.end[if_obj.variable] > if_obj.value);
            break;
        case 3:
            if_obj.bool = (if_obj.end[if_obj.variable] >= if_obj.value);
            break;
        case 4:
            if_obj.bool = (if_obj.end[if_obj.variable] < if_obj.value);
            break;
        case 5:
            if_obj.bool = (if_obj.end[if_obj.variable] <= if_obj.value);
            break;
        case 6:
            if_obj.bool = (if_obj.end[if_obj.variable] != if_obj.value);
            break;
    
        default:
            break;
    }
    switch (getRandomInt(2)) {
        case 0:
            if_obj.program.push(generateSkip());
            break;
        case 1:
            if_obj.program.push(generateAssign(if_obj));
            break;
    
        default:
            break;
    }
    program_obj.end = if_obj.end;
    return if_obj;
}

function generateDo(program_obj){
    var do_obj = new Object();
    do_obj.type = "do";
    do_obj.value =  getRandomInt(20)-10;
    do_obj.value2 =  getRandomInt(20)-10;
    do_obj.index = getRandomInt(program_obj.variable.length);
    do_obj.index2 = program_obj.variable.length;
    program_obj.variable.push(String.fromCharCode(97+program_obj.variable.length));
    do_obj.variable = program_obj.variable;
    do_obj.program = [];
    program_obj.start.push(do_obj.value2);
    program_obj.end.push(do_obj.value2);
    do_obj.before = [...program_obj.end];
    do_obj.end = program_obj.end;
    do_obj.bool = true;
    do_obj.change2 = getRandomInt(20)-10;
    do_obj.variant2 = getRandomInt(2)+1;
    if(do_obj.value > program_obj.end[do_obj.index]){
        do_obj.variant = 0;
        do_obj.multiplier = do_obj.value - program_obj.end[do_obj.index];

    } else if (do_obj.value < program_obj.end[do_obj.index]) {
        do_obj.variant = 1;
        do_obj.multiplier = program_obj.end[do_obj.index] - do_obj.value;
    } else {
        do_obj.value += 1;
        do_obj.variant = 0;
        do_obj.multiplier = do_obj.value - program_obj.end[do_obj.index];
    }
    switch (do_obj.variant) {
        case 0:
            do_obj.program.push(generateAssign(do_obj, do_obj.index, do_obj.multiplier, 1, 1));
            break;
    
        default:
            do_obj.program.push(generateAssign(do_obj, do_obj.index, do_obj.multiplier, 2, 1));
            break;
    }
    do_obj.program.push(generateAssign(do_obj, do_obj.index2, do_obj.multiplier, do_obj.variant2, do_obj.change2));
    program_obj.end = do_obj.end;
    return do_obj;

 

}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

function parseProgram(program_obj){
    programStr = "";
    programStrTemp = "";
    programStrQueue = [];
    if (program_obj.variant == 0){
        //programStr += "{ a = " + program_obj.start + " }\n";
        programStr += "{ ";
        programStrTemp += "{ ";
        for (let i = 0; i < program_obj.variable.length; i++) {
            if (i > 0){
                programStr += "& ";
                programStrTemp += "& ";
            }
            programStr += program_obj.variable[i] + " = " + program_obj.start[i] + " ";
            programStrTemp += program_obj.variable[i] + " = " + program_obj.end[i] + " ";
            
        }
        programStr += "}\n";
        programStrTemp += "}\n";
        programStrQueue.push(programStrTemp);
        programStrQueue.push("{ x }\n");
    } else{
        programStr += "{ ";
        programStrTemp += "{ ";
        for (let i = 0; i < program_obj.variable.length; i++) {
            if (i > 0){
                programStr += "& ";
                programStrTemp += "& ";
            }
            programStr += program_obj.variable[i] + " = " + program_obj.start[i] + " ";
            programStrTemp += program_obj.variable[i] + " = " + program_obj.end[i] + " ";
            
        }
        programStr += "}\n";
        programStrTemp += "}\n";
        programStr += "{ x }\n";
        programStrQueue.push(programStrTemp);
    }
    for (let i = 0; i < program_obj.length; i++) {
        switch (program_obj.program[i].type) {
            case "skip":
                programStr += parseSkip();
                break;
            case "assign":
                programStr += parseAssign(program_obj.program[i]);
                break;
            case "if":
                programStr += parseIf(program_obj.program[i]);
                break;
            case "do":
                programStr += parseDo(program_obj.program[i], program_obj);
                break;
            default:
                break;
        }
        if(program_obj.length - i > 1){
            programStr += ";\n";
        }
        else{
            programStr += "\n";
        }
    }
    while(programStrQueue.length > 0){
        programStr += programStrQueue.pop();
    }
    document.getElementById("program").value = programStr;
    return 0;
}

function parseSkip(){
    return "skip"
}

function parseAssign(assign_obj){
    switch (assign_obj.variant) {
        case 0:
            return assign_obj.variable[assign_obj.index] + " := " + assign_obj.assign;
        case 1:
            return assign_obj.variable[assign_obj.index] + " := " + assign_obj.variable[assign_obj.index] + " + " + assign_obj.assign;
        case 2:
            return assign_obj.variable[assign_obj.index] + " := " + assign_obj.variable[assign_obj.index] + " - " + assign_obj.assign;
    
        default:
            break;
    }
}

function parseIf(if_obj){
    ifStr = "if\n\t";
    switch (if_obj.variant) {
        case 0:
            ifStr += "true -> ";
            break;
        case 1:
            ifStr += if_obj.variable[if_obj.index] + " = " +  if_obj.value + " -> ";
            break;
        case 2:
            ifStr += if_obj.variable[if_obj.index] + " > " +  if_obj.value + " -> ";
            break;
        case 3:
            ifStr += if_obj.variable[if_obj.index] + " >= " +  if_obj.value + " -> ";
            break;
        case 4:
            ifStr += if_obj.variable[if_obj.index] + " < " +  if_obj.value + " -> ";
            break;
        case 5:
            ifStr += if_obj.variable[if_obj.index] + " <= " +  if_obj.value + " -> ";
            break;
        case 6:
            ifStr += if_obj.variable[if_obj.index] + " != " +  if_obj.value + " -> ";
            break;

        default:
            break;
    }
    switch (if_obj.program[0].type) {
        case "skip":
            ifStr += parseSkip();
            break;
        case "assign":
            ifStr += parseAssign(if_obj.program[0]);
            break;
        default:
            break;
    }
    ifStr += "\nfi";
    return ifStr;
}


function parseDo(do_obj, program_obj){
    doStr = "do";
    switch (do_obj.variant) {
        case 0:
            doStr += "[ "
            for (let i = 0; i < do_obj.before.length; i++) {
                if ( i > 0){
                    doStr += " & ";
                }
                if (i == do_obj.index){
                    doStr += do_obj.value + " >= " + do_obj.variable[i];
                }
                else if( i == do_obj.index2){
                    doStr += do_obj.variable[i] + " = " + do_obj.before[i];
                    if (do_obj.variant2 == 1){
                        doStr += " + ";
                    } else {
                        doStr += " - ";
                    }
                    doStr += do_obj.change2 + " * (" + do_obj.variable[do_obj.index] + " + " + (0-do_obj.before[do_obj.index]) + ")";
                } else {
                    doStr += do_obj.variable[i] + " = " + do_obj.before[i];
                }
            }
            if (program_obj.start.length > do_obj.before.length){
                doStr += " & " + program_obj.variable[program_obj.start.length-1] + " = " + program_obj.start[program_obj.start.length-1];
            }
            doStr += " ]\n\t";
            doStr += do_obj.value + " > " + do_obj.variable[do_obj.index] + " -> "
            break;
        case 1:
            doStr += "[ "
            for (let i = 0; i < do_obj.before.length; i++) {
                if ( i > 0){
                    doStr += " & ";
                }
                if (i == do_obj.index){
                    doStr += do_obj.value + " <= " + do_obj.variable[i];
                }
                else if( i == do_obj.index2){
                    doStr += do_obj.variable[i] + " = " + do_obj.before[i] 
                    if (do_obj.variant2 == 1){
                        doStr += " + ";
                    } else {
                        doStr += " - ";
                    }
                    doStr += do_obj.change2 + " * (-(" + do_obj.variable[do_obj.index] + " + " + (0-do_obj.before[do_obj.index]) + "))";
                    console.log(0-do_obj.before[do_obj.index]);
                } else {
                    doStr += do_obj.variable[i] + " = " + do_obj.before[i];
                }
            }
            if (program_obj.start.length > do_obj.before.length){
                doStr += " & " + program_obj.variable[program_obj.start.length-1] + " = " + program_obj.start[program_obj.start.length-1];
            }
            doStr += " ]\n\t";
            doStr += do_obj.value + " < " + do_obj.variable[do_obj.index] + " -> "
            break;

        default:
            break;
    }
    for (let i = 0; i < do_obj.program.length; i++) {
        if(i > 0){
            doStr += ";\n\t";
        }
        switch (do_obj.program[i].type) {
            case "skip":
                doStr += parseSkip();
                break;
            case "assign":
                doStr += parseAssign(do_obj.program[i]);
                break;
            default:
                break;
        } 
    }
    doStr += "\nod";
    return doStr;
}