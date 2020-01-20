=======================
Namespace: ``keystore``
=======================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _keystore.open:


Function: ``open``
==================



.. js:function:: open(keyfile, pass)

    
    :param object keyfile: <p>Keystore object in json format</p>
    :param string pass: <p>Password to decrypt Keystore</p>
    :return object: <p>privateKey and address pair from decryption</p>
    
.. _keystore.lock:


Function: ``lock``
==================



.. js:function:: lock(privatekey, pass)

    
    :param string privatekey: <p>PrivateKey to encrypt</p>
    :param string pass: <p>Password used to encrypt privateKey</p>
    :return object: <p>Keystore file</p>
    




