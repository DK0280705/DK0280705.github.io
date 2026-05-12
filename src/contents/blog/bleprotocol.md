This is a project made for Liberal Arts subject presentation.
Mainly made to help people with hearing issues.

The overall structure of the protocol looks like this:
![Protocol overall structurite](@/assets/bleprotocol-preview1.png)

The broadcaster sends transport notification to the repeater,
then repeater will send it further to another repeater until it reach the client.

The protocol diagram is shown as below:
![Protocol diagram](@/assets/bleprotocol-preview2.png)

It was actually quite hard to optimize the size of protocol header as i also have to consider
asymmetric cryptography in mind. Currently, i could only implement symmetric cryptography as 
BLE size limitation (31 bytes). I could improve this further by using BLE 5.0 as it could fit a whole 256 bytes of data, making it suitable for asymmetric signatures, but when i was working on this project, i don't have any esp32 controller with BLE 5.0 support.

So here is the cryptography diagram i made with symmetric cryptography:
![Protocol cryptography diagram](@/assets/bleprotocol-preview3.png)

[Source code](https://github.com/DK0280705/ble-protocol)