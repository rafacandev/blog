How to use Maps with Castor XML
-------------------------------

[Castor Documentation](http://castor-data-binding.github.io/castor/reference-guides/1.4.0/html-single/index.html) provides examples for handling the most common collections. However, handling Maps is not straight forward as my colleagues and I hoped.

[Their tests](https://github.com/castor-data-binding/castor/tree/master/xmlctf/tests/MasterTestSuite/mapping/collections/Maps) helped considerably; but, they still did not cover our scenario. Here is the mapping we used.

`Root.java`
```java
public class Root {
	Map<String, Integer> telephones = new HashMap<>();

	public Map<String, Integer> getTelephones() {
		return telephones;
	}

	public void setTelephones(Map<String, Integer> telephones) {
		this.telephones = telephones;
	}
}
```

`Phone.java`
```java
public class Phone {
	private String kind; // We avoided naming it as 'type' to do not mix with castor types
	private Integer number;

	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	public Integer getNumber() {
		return number;
	}

	public void setNumber(Integer number) {
		this.number = number;
	}
}
```

`mapping.xml`
```xml
<mapping>
  <class name="Root">
    <field name="telephones" collection="map">
      <bind-xml name="phone" location="phones">
        <class name="org.exolab.castor.mapping.MapItem">
          <field name="key" type="string">
            <bind-xml name="kind" node="attribute"/>
          </field>
          <field name="value" type="integer">
            <bind-xml node="text"/>
          </field>
        </class>
      </bind-xml>
    </field>
  </class>
</mapping>
```

`input.xml`
```xml
<root>
    <phones>
        <phone kind="home">1234</phone>
        <phone kind="mobile">4321</phone>
    </phones>
</root>
```
