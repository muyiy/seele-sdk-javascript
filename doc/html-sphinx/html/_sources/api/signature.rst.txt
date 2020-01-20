========================
Namespace: ``signature``
========================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _signature.signMsg:


Function: ``signMsg``
=====================



.. js:function:: signMsg(prikey, msg)

    
    :param string prikey: <p>Privatekey used to sign message</p>
    :param string msg: <p>Message to be signed</p>
    :return string: <p>String signature</p>
    
.. _signature.signTxn:


Function: ``signTxn``
=====================



.. js:function:: signTxn(prikey, tx)

    
    :param string prikey: <p>Privatekey used to sign transaction</p>
    :param object tx: <p>Transaction object to be signed</p>
    :return object: <p>Signed transaction object</p>
    
.. _signature.tellMsg:


Function: ``tellMsg``
=====================



.. js:function:: tellMsg(sign, msg)

    
    :param string sign: <p>Signature of signed message</p>
    :param string msg: <p>Signed message</p>
    :return string: <p>Address string</p>
    
.. _signature.tellTxn:


Function: ``tellTxn``
=====================



.. js:function:: tellTxn(sign, hash)

    
    :param string sign: <p>Signature of signed transaction</p>
    :param string hash: <p>Hash of transaction</p>
    :return string: <p>Address string</p>
    
.. _signature.initTxn:


Function: ``initTxn``
=====================



.. js:function:: initTxn(from, to, amount)

    
    :param string from: <p>Sender address</p>
    :param string to: <p>Receiver address</p>
    :param number amount: <p>Send amount</p>
    :return object: <p>transaction object</p>
    




