# KonvaUndoRedo
Here is the situation :
All 3 Konva-elements belong to one group. The big circle and the big rectangle have a listener : if you click they change color and become draggable independently. The thin cyan rectangle is the group handler.
_______________________________
The goal
The goal is to build an undo redo strategy for your dev, but avoiding the Json Canvas State strategy and choosing a function oriented method.
_______________________________
This example is based on a Pile logic means that it is looping from the first to the last (undo) and last to first(redo) whe the extrems are reached.

The objective is to build a function that you can add to your code to include the action in the undo-redo logic.
